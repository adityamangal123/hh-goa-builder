"use client";

import { useRef, useState } from "react";
import { normalizeImageFile } from "../lib/imageUtils";

type PhotoUploadProps = {
  photo: string | null;
  fileName: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
};

export default function PhotoUpload({
  photo,
  fileName,
  onUpload,
  onRemove,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);

 const handleChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setIsConverting(true);

    const normalizedFile = await normalizeImageFile(file);

    const normalizedName =
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
        ? file.name.replace(/\.(heic|heif)$/i, ".png")
        : file.name;

    const normalized = new File(
      [normalizedFile],
      normalizedName,
      {
        type: normalizedFile.type || "image/png",
      }
    );

    await onUpload(normalized);
  } catch (error) {
    console.error("Image conversion failed:", error);

    alert(
      "We couldn't process this photo. Please try another JPG, PNG or HEIC image."
    );
  } finally {
    setIsConverting(false);
  }
};

  return (
    <div>
      <label className="text-xs font-black tracking-[0.15em]">
        YOUR PHOTO
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        onChange={handleChange}
        className="hidden"
      />

      {!photo ? (
        <button
          type="button"
          disabled={isConverting}
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#17251d]/25 bg-[#f7e6ca] transition hover:border-[#ef6c3d] hover:bg-[#f4dfbd]"
        >
            {isConverting ? (
    <>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#17251d] text-xl text-white">
        …
        </div>

        <p className="mt-3 text-sm font-black">
        Processing photo...
        </p>

        <p className="mt-1 text-xs text-[#17251d]/50">
        Preparing your image
        </p>
    </>
    ) : (
    <>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef6c3d] text-3xl text-white">
        +
        </div>

        <p className="mt-3 text-sm font-black">
        Upload your photo
        </p>

        <p className="mt-1 text-xs text-[#17251d]/50">
        JPG • PNG • HEIC
        </p>
    </>
    )}
        </button>
      ) : (
        <div className="mt-3">
          <div className="relative h-48 overflow-hidden rounded-2xl bg-[#17251d]">
            <img
              src={photo}
              alt="Uploaded builder"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={onRemove}
              className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 text-xs font-black shadow-lg"
            >
              Remove
            </button>
          </div>

          <p className="mt-2 truncate text-xs text-[#17251d]/50">
            {fileName}
          </p>
        </div>
      )}
    </div>
  );
}