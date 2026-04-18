import { useCallback, useRef, useState } from "react";
import type { SwapState, SwapStatus, UploadedImage } from "../types";

const POLLING_INTERVAL_MS = 2000;
const TIMEOUT_MS = 120000;
const REPLICATE_API_KEY = "YOUR_REPLICATE_API_KEY";
// Replicate model: lucataco/faceswap
const MODEL_VERSION =
  "9a4298548422074c3f57258c5d544497a19901a0f1a6cc0b3e88e9dc26e07c7f";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const initialState: SwapState = {
  status: "idle",
  sourceImage: null,
  targetImage: null,
  resultUrl: null,
  errorMessage: null,
  predictionId: null,
  elapsedSeconds: 0,
  swapCount: 0,
};

export function useFaceSwap() {
  const [state, setState] = useState<SwapState>(initialState);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    pollingRef.current = null;
    timeoutRef.current = null;
    elapsedRef.current = null;
  }, []);

  const setStatus = useCallback((status: SwapStatus) => {
    setState((s) => ({ ...s, status }));
  }, []);

  const setError = useCallback(
    (message: string) => {
      clearTimers();
      setState((s) => ({ ...s, status: "error", errorMessage: message }));
    },
    [clearTimers],
  );

  const setSourceImage = useCallback((image: UploadedImage | null) => {
    setState((s) => ({ ...s, sourceImage: image }));
  }, []);

  const setTargetImage = useCallback((image: UploadedImage | null) => {
    setState((s) => ({ ...s, targetImage: image }));
  }, []);

  const pollPrediction = useCallback(
    async (predictionId: string) => {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              Authorization: `Token ${REPLICATE_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Poll failed: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          status: string;
          output?: string[] | string | null;
          error?: string | null;
        };

        if (data.status === "succeeded") {
          clearTimers();
          const output = data.output;
          const resultUrl = Array.isArray(output) ? output[0] : output;
          setState((s) => ({
            ...s,
            status: "success",
            resultUrl: resultUrl ?? null,
            swapCount: s.swapCount + 1,
          }));
        } else if (data.status === "failed" || data.status === "canceled") {
          setError(data.error ?? "Face swap failed. Please try again.");
        }
        // still processing — keep polling
      } catch (err) {
        setError(err instanceof Error ? err.message : "Polling error");
      }
    },
    [clearTimers, setError],
  );

  const startSwap = useCallback(async () => {
    const { sourceImage, targetImage } = state;
    if (!sourceImage || !targetImage) return;

    clearTimers();
    setState((s) => ({
      ...s,
      status: "uploading",
      resultUrl: null,
      errorMessage: null,
      predictionId: null,
      elapsedSeconds: 0,
    }));

    try {
      const [sourceBase64, targetBase64] = await Promise.all([
        toBase64(sourceImage.file),
        toBase64(targetImage.file),
      ]);

      setState((s) => ({ ...s, status: "processing" }));

      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: MODEL_VERSION,
          input: {
            target_image: targetBase64,
            swap_image: sourceBase64,
          },
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { detail?: string };
        throw new Error(
          errorData.detail ?? `API error: ${response.statusText}`,
        );
      }

      const prediction = (await response.json()) as { id: string };
      const predictionId = prediction.id;

      setState((s) => ({ ...s, status: "polling", predictionId }));

      startTimeRef.current = Date.now();

      // elapsed timer
      elapsedRef.current = setInterval(() => {
        setState((s) => ({
          ...s,
          elapsedSeconds: Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          ),
        }));
      }, 1000);

      // polling
      pollingRef.current = setInterval(() => {
        void pollPrediction(predictionId);
      }, POLLING_INTERVAL_MS);

      // timeout
      timeoutRef.current = setTimeout(() => {
        setError("Processing timed out after 120 seconds. Please try again.");
      }, TIMEOUT_MS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, [state, clearTimers, pollPrediction, setError]);

  const reset = useCallback(() => {
    clearTimers();
    setState((s) => ({ ...initialState, swapCount: s.swapCount }));
  }, [clearTimers]);

  return {
    state,
    setSourceImage,
    setTargetImage,
    startSwap,
    reset,
    setStatus,
    swapCount: state.swapCount,
  };
}
