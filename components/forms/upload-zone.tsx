"use client";

import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

export function UploadZone({
  label,
  hint,
  accept,
  maxFiles,
  onUploadComplete,
  existingUrls,
  disabled,
}: {
  label: string;
  hint: string;
  accept: Record<string, string[]>;
  maxFiles: number;
  onUploadComplete: (files: File[]) => void;
  existingUrls?: string[];
  disabled?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    disabled,
    onDrop: onUploadComplete,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "rounded-3xl border border-dashed border-brand-gold/50 bg-brand-cream px-6 py-8 text-center transition",
        isDragActive && "bg-brand-gold/10",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input {...getInputProps()} />
      <p className="font-semibold text-brand-dark-text">{label}</p>
      <p className="mt-2 text-sm text-brand-gray">{hint}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-brand-gold">Upload up to {maxFiles} files</p>
      {existingUrls?.length ? <p className="mt-3 text-xs text-brand-gray">{existingUrls.length} file(s) already attached</p> : null}
    </div>
  );
}
