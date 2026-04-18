import Types "../types/face-swap";
import Text "mo:core/Text";
import Char "mo:core/Char";

module {

  /// Builds the JSON body for a Replicate face-swap prediction request
  public func buildRequestBody(faceImageUrl : Text, targetImageUrl : Text) : Text {
    "{\"version\":\"latest\",\"input\":{\"target_image\":\"" # targetImageUrl # "\",\"swap_image\":\"" # faceImageUrl # "\"}}";
  };

  /// Parses the prediction ID from a Replicate predictions response JSON string.
  public func parsePredictionId(json : Text) : Types.SwapResult {
    switch (findJsonStringValue(json, "\"id\":\"")) {
      case (?id) #ok(id);
      case null #err(#apiError("Could not parse prediction ID from response"));
    };
  };

  /// Parses the status and output URL from a Replicate prediction status JSON string.
  public func parsePollResponse(json : Text) : Types.PollResult {
    let status = switch (findJsonStringValue(json, "\"status\":\"")) {
      case (?s) s;
      case null { return #err(#apiError("Could not parse status from response")) };
    };

    let predStatus : Types.PredictionStatus = switch (status) {
      case "starting" #starting;
      case "processing" #processing;
      case "succeeded" #succeeded;
      case "failed" #failed;
      case _ { return #err(#apiError("Unknown status: " # status)) };
    };

    let outputUrl : ?Text = switch (predStatus) {
      case (#succeeded) findJsonStringValue(json, "\"output\":\"");
      case _ null;
    };

    #ok({ status = predStatus; outputUrl });
  };

  /// Validates that both URLs are non-empty before making API calls
  public func validateUrls(faceImageUrl : Text, targetImageUrl : Text) : ?Types.SwapError {
    if (faceImageUrl == "") {
      ?#invalidInput("Face image URL must not be empty")
    } else if (targetImageUrl == "") {
      ?#invalidInput("Target image URL must not be empty")
    } else {
      null
    };
  };

  /// Finds and extracts a JSON string value following the given key pattern.
  /// Splits on the key and extracts the value up to the next double-quote.
  private func findJsonStringValue(json : Text, key : Text) : ?Text {
    // Split the JSON text on the key pattern
    let parts = json.split(#text(key));
    // Discard first segment (before the key), check if there's a second
    let iter = parts;
    switch (iter.next()) {
      case null null;
      case (?_) {
        switch (iter.next()) {
          case null null;
          case (?afterKey) {
            // Extract text up to the next double-quote
            let dquote = Char.fromNat32(34);
            var value = "";
            var done = false;
            for (c in afterKey.chars()) {
              if (not done) {
                if (c == dquote) {
                  done := true;
                } else {
                  value #= c.toText();
                };
              };
            };
            ?value;
          };
        };
      };
    };
  };

};
