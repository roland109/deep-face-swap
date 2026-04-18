import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PollResult = {
    __kind__: "ok";
    ok: PollResponse;
} | {
    __kind__: "err";
    err: SwapError;
};
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type SwapResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: SwapError;
};
export type SwapError = {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "networkError";
    networkError: string;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "apiError";
    apiError: string;
};
export interface PollResponse {
    status: PredictionStatus;
    outputUrl?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum PredictionStatus {
    starting = "starting",
    processing = "processing",
    failed = "failed",
    succeeded = "succeeded"
}
export interface backendInterface {
    pollFaceSwap(predictionId: string): Promise<PollResult>;
    startFaceSwap(faceImageUrl: string, targetImageUrl: string): Promise<SwapResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
