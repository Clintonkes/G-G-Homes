"use client";

import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

export function UploadZone({
  accept,
  maxFiles,
  onUploadComplete,
  existingUrls,
}: {
  accept: Record<string, string[]>;
  maxFiles: number;
  onUploadComplete: (files: File[]) => void;
  existingUrls?: string[];
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    onDrop: onUploadComplete,
  });

  return (
    <div {...getRootProps()} className={cn("rounded-3xl border border-dashed border-brand-gold/50 bg-brand-cream px-6 py-12 text-center", isDragActive && "bg-brand-gold/10")}>
      <input {...getInputProps()} />
      <p className="font-semibold text-brand-dark-text">Drag and drop files here</p>
      <p className="mt-2 text-sm text-brand-gray">Upload up to {maxFiles} files</p>
      {existingUrls?.length ? <p className="mt-3 text-xs text-brand-gray">{existingUrls.length} file(s) already attached</p> : null}
    </div>
  );
}
