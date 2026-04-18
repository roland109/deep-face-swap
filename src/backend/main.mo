import FaceSwapMixin "mixins/face-swap-api";

actor {
  let replicateApiKey : Text = "YOUR_REPLICATE_API_KEY";

  include FaceSwapMixin(replicateApiKey);
};
