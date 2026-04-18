module {

  /// Status of a Replicate prediction job
  public type PredictionStatus = {
    #starting;
    #processing;
    #succeeded;
    #failed;
  };

  /// Result of initiating a face swap — returns the prediction ID
  public type SwapResult = {
    #ok : Text;
    #err : SwapError;
  };

  /// Result of polling a prediction — returns status and optional output URL
  public type PollResult = {
    #ok : PollResponse;
    #err : SwapError;
  };

  public type PollResponse = {
    status : PredictionStatus;
    outputUrl : ?Text;
  };

  /// Unified error variants for all face-swap operations
  public type SwapError = {
    #networkError : Text;
    #apiError : Text;
    #invalidInput : Text;
    #notFound;
  };

};
