"use client";

import { useRef } from "react";

type PhotoUploadProps = {
  photo: string | null;
  fileName: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

export default function PhotoUpload({
  photo,
  fileName,
  onUpload,
  onRemove,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
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
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#17251d]/25 bg-[#f7e6ca] transition hover:border-[#ef6c3d] hover:bg-[#f4dfbd]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef6c3d] text-3xl text-white">
            +
          </div>

          <p className="mt-3 text-sm font-black">
            Upload your photo
          </p>

          <p className="mt-1 text-xs text-[#17251d]/50">
            JPG • PNG • HEIC
          </p>
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