import type { backendInterface } from "../backend";
import { PredictionStatus } from "../backend";

export const mockBackend: backendInterface = {
  startFaceSwap: async (_faceImageUrl: string, _targetImageUrl: string) => ({
    __kind__: "ok" as const,
    ok: "mock-prediction-id-12345",
  }),
  pollFaceSwap: async (_predictionId: string) => ({
    __kind__: "ok" as const,
    ok: {
      status: PredictionStatus.succeeded,
      outputUrl: "https://picsum.photos/seed/faceswap/600/400",
    },
  }),
  transform: async (input) => ({
    status: BigInt(200),
    body: new Uint8Array(),
    headers: [],
  }),
};
