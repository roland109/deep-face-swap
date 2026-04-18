import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { UploadedImage } from "../types";

const MAX_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface UploadZoneProps {
  label: string;
  sublabel: string;
  stepNumber: number;
  image: UploadedImage | null;
  onImageSelect: (img: UploadedImage) => void;
  onImageClear?: () => void;
  ocid: string;
  disabled?: boolean;
}

export function UploadZone({
  label,
  sublabel,
  stepNumber,
  image,
  onImageSelect,
  onImageClear,
  ocid,
  disabled,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError("Only JPG, PNG, or WEBP files are accepted.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File must be smaller than ${MAX_SIZE_MB}MB.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onImageSelect({ file, previewUrl });
    },
    [onImageSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect, disabled],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
      // reset input so same file can be re-selected
      e.target.value = "";
    },
    [validateAndSelect],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setError(null);
      onImageClear?.();
    },
    [onImageClear],
  );

  const borderClass = isDragOver
    ? "border-accent border-solid shadow-glow"
    : image
      ? "border-accent/50 border-solid"
      : "border-border/60 border-dashed hover:border-accent/40";

  return (
    <div className="flex flex-col gap-2">
      {/* Card header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow shrink-0">
          <span className="text-xs font-bold font-display text-accent">
            {stepNumber}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground font-display leading-tight">
            {label}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {sublabel}
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <label
        className={`relative rounded-xl border-2 transition-smooth cursor-pointer group overflow-hidden block
          ${image ? "bg-card" : "bg-card/40 hover:bg-card/60"}
          ${borderClass}
          ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-ocid={ocid}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={handleChange}
          disabled={disabled}
          data-ocid={`${ocid}.input`}
        />

        {image ? (
          <div className="relative aspect-[4/3] w-full">
            <img
              src={image.previewUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-accent">
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium font-display">
                  Change photo
                </span>
              </div>
            </div>
            {/* Status badge */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-accent/10 text-accent border-accent/30 text-xs font-mono">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Loaded
              </Badge>
            </div>
            {/* Clear button */}
            {onImageClear && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border/60 flex items-center justify-center hover:bg-background hover:border-destructive/60 transition-smooth"
                aria-label="Remove image"
                data-ocid={`${ocid}.clear_button`}
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        ) : (
          <div
            className={`aspect-[4/3] w-full flex flex-col items-center justify-center gap-3 p-6 transition-smooth
              ${isDragOver ? "scale-[1.01]" : ""}
            `}
          >
            <div
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-smooth
                ${isDragOver ? "bg-accent/20 border-accent/50 shadow-glow" : "bg-accent/10 border-accent/20 group-hover:shadow-glow"}
              `}
            >
              <Upload
                className={`w-6 h-6 transition-colors
                  ${isDragOver ? "text-accent" : "text-accent/60 group-hover:text-accent"}
                `}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground/80 font-display">
                {isDragOver ? "Drop to upload" : "Drag & drop or click"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, WEBP • max {MAX_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}
      </label>

      {/* Inline error */}
      {error && (
        <p
          className="text-xs text-destructive font-mono pl-1 fade-in"
          data-ocid={`${ocid}.field_error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
