"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type PhotoPosition = {
  x: number;
  y: number;
  zoom: number;
};

type BuilderCardProps = {
  photo: string | null;
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  photoPosition: PhotoPosition;
  onPhotoPositionChange: (
    position: PhotoPosition
  ) => void;
};

export default function BuilderCard({
  photo,
  name,
  role,
  stack,
  builderTitle,
  photoPosition,
  onPhotoPositionChange,
}: BuilderCardProps) {
  const stackItems = getStackItems(stack);

  const photoContainerRef =
    useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startPhotoX: 50,
    startPhotoY: 50,
  });

  const [isDraggingPhoto, setIsDraggingPhoto] =
    useState(false);

  const handlePhotoPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!photo) return;

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startPhotoX: photoPosition.x,
      startPhotoY: photoPosition.y,
    };

    setIsDraggingPhoto(true);
  };

  const handlePhotoPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!dragRef.current.active) return;

    const container =
      photoContainerRef.current;

    if (!container) return;

    const rect =
      container.getBoundingClientRect();

    const deltaX =
      ((event.clientX - dragRef.current.startX) /
        rect.width) *
      100;

    const deltaY =
      ((event.clientY - dragRef.current.startY) /
        rect.height) *
      100;

    const nextX = Math.max(
      0,
      Math.min(
        100,
        dragRef.current.startPhotoX + deltaX
      )
    );

    const nextY = Math.max(
      0,
      Math.min(
        100,
        dragRef.current.startPhotoY + deltaY
      )
    );

    onPhotoPositionChange({
      ...photoPosition,
      x: nextX,
      y: nextY,
    });
  };

  const handlePhotoPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    dragRef.current.active = false;

    setIsDraggingPhoto(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }
  };

  const zoomOut = () => {
    onPhotoPositionChange({
      ...photoPosition,
      zoom: Math.max(
        1,
        Number(
          (photoPosition.zoom - 0.1).toFixed(2)
        )
      ),
    });
  };

  const zoomIn = () => {
    onPhotoPositionChange({
      ...photoPosition,
      zoom: Math.min(
        2,
        Number(
          (photoPosition.zoom + 0.1).toFixed(2)
        )
      ),
    });
  };

  const resetPhoto = () => {
    onPhotoPositionChange({
      x: 50,
      y: 50,
      zoom: 1,
    });
  };

  return (
    <div>
      {/* Preview heading */}
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-[#ef6c3d]">
            LIVE PREVIEW
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Your Builder Card
          </h2>
        </div>

        <span className="rounded-full bg-[#17251d] px-3 py-1 text-[10px] font-black tracking-wider text-white">
          LIVE
        </span>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-[520px] rounded-[2rem] border-2 border-[#17251d] bg-white p-3 shadow-[10px_10px_0px_#ef6c3d]">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f7e6ca]">
          {/* Background sun */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f6b73c]" />

          {/* Ocean */}
          <div className="absolute -bottom-20 -left-10 h-44 w-64 rounded-[50%] bg-[#4ea8a1] opacity-80" />

          {/* Palm */}
          <div className="absolute bottom-0 right-0 text-[110px] opacity-[0.08]">
            🌴
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between p-6">
            <div>
              <div className="text-2xl font-black tracking-tight">
                HH GOA
              </div>

              <div className="text-[10px] font-black tracking-[0.35em]">
                2026
              </div>
            </div>

            <div className="rounded-full bg-[#17251d] px-3 py-1.5 text-[9px] font-black tracking-wider text-white">
              BUILDER
            </div>
          </div>

          {/* Photo */}
          <div className="relative z-10 px-6">
            <div
              ref={photoContainerRef}
              onPointerDown={
                handlePhotoPointerDown
              }
              onPointerMove={
                handlePhotoPointerMove
              }
              onPointerUp={handlePhotoPointerUp}
              onPointerCancel={
                handlePhotoPointerUp
              }
              className={`relative aspect-[4/3] touch-none select-none overflow-hidden rounded-[1.5rem] border-2 border-[#17251d] bg-[#fff8ed] shadow-[5px_5px_0px_#17251d] ${
                photo
                  ? isDraggingPhoto
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : ""
              }`}
            >
              {photo ? (
                <>
                  <img
                    src={photo}
                    alt="Builder preview"
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${photoPosition.x}% ${photoPosition.y}%`,
                      transform: `scale(${photoPosition.zoom})`,
                      transformOrigin:
                        "center center",
                    }}
                  />

                  {/* Drag hint */}
                  <div
                    className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#17251d]/75 px-3 py-1.5 text-[9px] font-black tracking-[0.12em] text-white backdrop-blur-sm transition-opacity ${
                      isDraggingPhoto
                        ? "opacity-100"
                        : "opacity-70"
                    }`}
                  >
                    {isDraggingPhoto
                      ? "MOVE PHOTO"
                      : "DRAG TO FRAME"}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="text-5xl opacity-30">
                    ☀
                  </div>

                  <p className="mt-3 text-xs font-black uppercase tracking-wider text-[#17251d]/40">
                    Your photo goes here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Photo controls */}
          {photo && (
            <div className="relative z-10 flex items-center justify-center gap-3 px-6 pt-3">
              <button
                type="button"
                onClick={zoomOut}
                disabled={photoPosition.zoom <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17251d] bg-white text-sm font-black transition hover:bg-[#17251d] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Zoom out"
              >
                −
              </button>

              <span className="min-w-[42px] text-center text-[9px] font-black tracking-[0.15em] text-[#17251d]/50">
                {photoPosition.zoom.toFixed(1)}×
              </span>

              <button
                type="button"
                onClick={zoomIn}
                disabled={photoPosition.zoom >= 2}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17251d] bg-white text-sm font-black transition hover:bg-[#17251d] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Zoom in"
              >
                +
              </button>

              <button
                type="button"
                onClick={resetPhoto}
                className="ml-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#ef6c3d]"
              >
                Reset
              </button>
            </div>
          )}

          {/* Card information */}
          <div className="relative z-10 p-6">
            {/* Name */}
            <div className="text-3xl font-black leading-none tracking-[-0.04em] md:text-4xl">
              {name || "YOUR NAME"}
            </div>

            {/* Role */}
            <div className="mt-2 text-xs font-black uppercase tracking-[0.15em] text-[#ef6c3d]">
              {role || "YOUR ROLE"}
            </div>

            {/* Stack */}
            <div className="mt-5">
              <p className="text-[9px] font-black tracking-[0.2em] text-[#17251d]/40">
                STACK
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {stackItems.map(
                  (item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="rounded-full border border-[#17251d]/15 bg-white/70 px-3 py-1.5 text-[10px] font-bold backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Builder title */}
            <div className="mt-6 rounded-2xl border-2 border-[#17251d] bg-[#ef6c3d] p-4 text-white shadow-[4px_4px_0px_#17251d]">
              <p className="text-[8px] font-black tracking-[0.2em] opacity-70">
                BUILDER TITLE
              </p>

              <p className="mt-1 text-xl font-black">
                {builderTitle}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black tracking-[0.15em]">
                  BUILD • SHIP • CONNECT
                </p>

                <p className="mt-1 text-[8px] text-[#17251d]/40">
                  HH Goa 2026
                </p>
              </div>

              <div className="text-xs font-black">
                #FrameInGoa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStackItems(stack: string) {
  if (!stack.trim()) {
    return ["YOUR STACK"];
  }

  return stack
    .split(/[•,|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}