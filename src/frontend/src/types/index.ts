export type SwapStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "polling"
  | "success"
  | "error";

export interface UploadedImage {
  file: File;
  previewUrl: string;
  dataUrl?: string;
}

export interface SwapState {
  status: SwapStatus;
  sourceImage: UploadedImage | null;
  targetImage: UploadedImage | null;
  resultUrl: string | null;
  errorMessage: string | null;
  predictionId: string | null;
  elapsedSeconds: number;
  swapCount: number;
}

export interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string[] | string | null;
  error?: string | null;
  urls?: {
    get: string;
    cancel: string;
  };
}

export interface CameraState {
  isStreaming: boolean;
  hasPermission: boolean | null;
  capturedFrame: UploadedImage | null;
  detectionActive: boolean;
}

export type LiveSwapMode = "live-cam" | "photo";
