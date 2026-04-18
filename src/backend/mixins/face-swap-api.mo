import Types "../types/face-swap";
import FaceSwapLib "../lib/face-swap";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (apiKey : Text) {

  /// Transform callback required by the IC HTTP outcall system
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Initiates a face swap by submitting a prediction to Replicate.
  /// Accepts a source face image URL and a target image URL.
  /// Returns a prediction ID on success.
  public func startFaceSwap(faceImageUrl : Text, targetImageUrl : Text) : async Types.SwapResult {
    switch (FaceSwapLib.validateUrls(faceImageUrl, targetImageUrl)) {
      case (?err) return #err(err);
      case null {};
    };

    let body = FaceSwapLib.buildRequestBody(faceImageUrl, targetImageUrl);
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    let url = "https://api.replicate.com/v1/predictions";

    try {
      let response = await OutCall.httpPostRequest(url, headers, body, transform);
      FaceSwapLib.parsePredictionId(response);
    } catch (e) {
      #err(#networkError("HTTP request failed"));
    };
  };

  /// Polls the status of an existing Replicate prediction.
  /// Returns the current status and, when succeeded, the output image URL.
  public func pollFaceSwap(predictionId : Text) : async Types.PollResult {
    if (predictionId == "") return #err(#invalidInput("Prediction ID must not be empty"));

    let url = "https://api.replicate.com/v1/predictions/" # predictionId;
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # apiKey },
    ];

    try {
      let response = await OutCall.httpGetRequest(url, headers, transform);
      FaceSwapLib.parsePollResponse(response);
    } catch (e) {
      #err(#networkError("HTTP request failed"));
    };
  };

};
