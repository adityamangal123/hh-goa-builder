"use client";

import { useRef, useState } from "react";

import PhotoUpload from "./components/PhotoUpload";
import BuilderForm from "./components/BuilderForm";
import BuilderCard from "./components/BuilderCard";
import { getBuilderTitle } from "./lib/builderTitles";

type PhotoPosition = {
  x: number;
  y: number;
  zoom: number;
};

export default function Home() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [photo, setPhoto] =
    useState<string | null>(null);

  const [fileName, setFileName] =
    useState("");

  const [name, setName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [stack, setStack] =
    useState("");

  const [photoPosition, setPhotoPosition] =
    useState<PhotoPosition>({
      x: 50,
      y: 50,
      zoom: 1,
    });

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isSharing, setIsSharing] =
    useState(false);

  const builderTitle =
    getBuilderTitle(role);

  /*
   * Upload
   */
  const handleUpload = async (
    file: File
  ) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];

    if (!validTypes.includes(file.type)) {
      alert(
        "Please upload a JPG, PNG or HEIC image."
      );
      return;
    }

    if (photo) {
      URL.revokeObjectURL(photo);
    }

    const imageUrl =
      URL.createObjectURL(file);

    setPhoto(imageUrl);
    setFileName(file.name);

    setPhotoPosition({
      x: 50,
      y: 50,
      zoom: 1,
    });
  };

  /*
   * Remove photo
   */
  const removePhoto = () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }

    setPhoto(null);
    setFileName("");

    setPhotoPosition({
      x: 50,
      y: 50,
      zoom: 1,
    });
  };

  /*
   * Create the actual PNG blob.
   *
   * This is shared by both:
   *
   * DOWNLOAD
   *
   * and
   *
   * SHARE TO X
   *
   * so both flows always use the exact
   * same generated card.
   */
  const createCardBlob =
    async (): Promise<Blob | null> => {
      if (
        !photo ||
        !name ||
        !role ||
        !stack
      ) {
        return null;
      }

      const canvas =
        canvasRef.current;

      if (!canvas) {
        throw new Error(
          "Canvas is not available."
        );
      }

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "Canvas context is not available."
        );
      }

      const WIDTH = 1080;
      const HEIGHT = 1350;

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      /*
       * Background
       */
      ctx.fillStyle = "#f7e6ca";

      ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
      );

      /*
       * Sun
       */
      ctx.fillStyle = "#f6b73c";

      ctx.beginPath();

      ctx.arc(
        900,
        80,
        210,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /*
       * Ocean
       */
      ctx.fillStyle = "#4ea8a1";

      ctx.beginPath();

      ctx.ellipse(
        180,
        1370,
        500,
        180,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /*
       * Rounded rectangle helper
       */
      const roundedRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) => {
        ctx.beginPath();

        ctx.roundRect(
          x,
          y,
          width,
          height,
          radius
        );
      };

      /*
       * Photo dimensions
       */
      const photoX = 90;
      const photoY = 190;
      const photoWidth = 900;
      const photoHeight = 620;

      /*
       * Photo shadow
       */
      ctx.fillStyle = "#17251d";

      roundedRect(
        photoX + 10,
        photoY + 10,
        photoWidth,
        photoHeight,
        35
      );

      ctx.fill();

      /*
       * Load uploaded image
       */
      const image =
        new Image();

      image.src = photo;

      await new Promise<void>(
        (resolve, reject) => {
          image.onload = () =>
            resolve();

          image.onerror = () =>
            reject(
              new Error(
                "Unable to load image."
              )
            );
        }
      );

      /*
       * Calculate cover crop
       */
      const imageRatio =
        image.width /
        image.height;

      const boxRatio =
        photoWidth /
        photoHeight;

      let baseSourceWidth =
        image.width;

      let baseSourceHeight =
        image.height;

      if (
        imageRatio > boxRatio
      ) {
        baseSourceWidth =
          image.height *
          boxRatio;
      } else {
        baseSourceHeight =
          image.width /
          boxRatio;
      }

      /*
       * Apply zoom
       */
      const zoom =
        Math.max(
          1,
          Math.min(
            2,
            photoPosition.zoom
          )
        );

      let sourceWidth =
        baseSourceWidth / zoom;

      let sourceHeight =
        baseSourceHeight / zoom;

      sourceWidth =
        Math.min(
          sourceWidth,
          image.width
        );

      sourceHeight =
        Math.min(
          sourceHeight,
          image.height
        );

      /*
       * Calculate maximum movement
       */
      const maxSourceX =
        Math.max(
          0,
          image.width -
            sourceWidth
        );

      const maxSourceY =
        Math.max(
          0,
          image.height -
            sourceHeight
        );

      /*
       * Convert live preview position
       * into Canvas crop position.
       */
      const sourceX =
        maxSourceX *
        (photoPosition.x / 100);

      const sourceY =
        maxSourceY *
        (photoPosition.y / 100);

      /*
       * Draw photo
       */
      ctx.save();

      roundedRect(
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        35
      );

      ctx.clip();

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        photoX,
        photoY,
        photoWidth,
        photoHeight
      );

      ctx.restore();

      /*
       * Photo border
       */
      ctx.strokeStyle =
        "#17251d";

      ctx.lineWidth = 6;

      roundedRect(
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        35
      );

      ctx.stroke();

      /*
       * Header
       */
      ctx.fillStyle =
        "#17251d";

      ctx.font =
        "900 42px Arial";

      ctx.fillText(
        "HH GOA",
        90,
        80
      );

      ctx.font =
        "900 18px Arial";

      ctx.fillText(
        "2026",
        95,
        112
      );

      /*
       * Builder badge
       */
      ctx.fillStyle =
        "#17251d";

      roundedRect(
        820,
        55,
        170,
        55,
        28
      );

      ctx.fill();

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "900 17px Arial";

      ctx.textAlign =
        "center";

      ctx.fillText(
        "BUILDER",
        905,
        90
      );

      ctx.textAlign =
        "left";

      /*
       * Name
       */
      ctx.fillStyle =
        "#17251d";

      const displayName =
        name.length > 22
          ? name.substring(
              0,
              22
            )
          : name;

      ctx.font =
        "900 52px Arial";

      ctx.fillText(
        displayName.toUpperCase(),
        90,
        900
      );

      /*
       * Role
       */
      ctx.fillStyle =
        "#ef6c3d";

      ctx.font =
        "900 22px Arial";

      ctx.fillText(
        role.toUpperCase(),
        90,
        940
      );

      /*
       * Stack label
       */
      ctx.fillStyle =
        "#17251d";

      ctx.font =
        "900 13px Arial";

      ctx.fillText(
        "STACK",
        90,
        985
      );

      /*
       * Stack pills
       */
      const stackItems =
        stack
          .split(/[•,|]/)
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean)
          .slice(0, 6);

      let stackX = 90;
      let stackY = 1005;

      ctx.font =
        "700 16px Arial";

      stackItems.forEach(
        (item) => {
          const textWidth =
            ctx.measureText(
              item
            ).width;

          const pillWidth =
            textWidth + 30;

          if (
            stackX +
              pillWidth >
            990
          ) {
            stackX = 90;
            stackY += 50;
          }

          ctx.fillStyle =
            "#ffffff";

          roundedRect(
            stackX,
            stackY,
            pillWidth,
            40,
            20
          );

          ctx.fill();

          ctx.strokeStyle =
            "#17251d";

          ctx.lineWidth = 1;

          roundedRect(
            stackX,
            stackY,
            pillWidth,
            40,
            20
          );

          ctx.stroke();

          ctx.fillStyle =
            "#17251d";

          ctx.fillText(
            item,
            stackX + 15,
            stackY + 26
          );

          stackX +=
            pillWidth + 10;
        }
      );

      /*
       * Builder title
       */
      ctx.fillStyle =
        "#ef6c3d";

      roundedRect(
        90,
        1080,
        900,
        115,
        25
      );

      ctx.fill();

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "900 13px Arial";

      ctx.fillText(
        "BUILDER TITLE",
        115,
        1110
      );

      ctx.font =
        "900 30px Arial";

      ctx.fillText(
        builderTitle,
        115,
        1155
      );

      /*
       * Footer
       */
      ctx.fillStyle =
        "#17251d";

      ctx.font =
        "900 14px Arial";

      ctx.fillText(
        "BUILD • SHIP • CONNECT",
        90,
        1260
      );

      ctx.font =
        "700 15px Arial";

      ctx.textAlign =
        "right";

      ctx.fillText(
        "#FrameInGoa",
        990,
        1260
      );

      ctx.textAlign =
        "left";

      /*
       * Convert Canvas to PNG.
       */
      return await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/png",
            1
          );
        }
      );
    };

  /*
   * Download generated PNG
   */
  const generateCard =
    async () => {
      if (
        !photo ||
        !name ||
        !role ||
        !stack
      ) {
        alert(
          "Please complete your profile first."
        );

        return;
      }

      setIsGenerating(true);

      try {
        const blob =
          await createCardBlob();

        if (!blob) {
          throw new Error(
            "Could not create PNG."
          );
        }

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "HH-Goa-2026-Builder-Card.png";

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(
          "Card generation failed:",
          error
        );

        alert(
          "We couldn't create your card. Please try again."
        );
      } finally {
        setIsGenerating(false);
      }
    };

  /*
   * Share caption
   */
  const shareCaption =
    `I just created my HH Goa 2026 Builder Card 🌴\n\nBuilding, shipping and connecting in Goa.\n\n#FrameInGoa`;

  /*
   * Share to X
   *
   * On supported mobile browsers:
   * - generates the real PNG
   * - invokes the native share sheet
   * - includes the PNG file + caption
   *
   * On browsers without file sharing:
   * - downloads the PNG
   * - opens X with the caption pre-filled
   */
  const shareToX =
    async () => {
      if (
        !photo ||
        !name ||
        !role ||
        !stack
      ) {
        alert(
          "Please complete your profile first."
        );

        return;
      }

      setIsSharing(true);

      try {
        const blob =
          await createCardBlob();

        if (!blob) {
          throw new Error(
            "Could not create PNG."
          );
        }

        const file =
          new File(
            [blob],
            "HH-Goa-2026-Builder-Card.png",
            {
              type: "image/png",
            }
          );

        /*
         * Best experience on supported phones.
         *
         * The native share sheet can expose X
         * as a sharing destination when available.
         */
        const canShareFiles =
          typeof navigator !==
            "undefined" &&
          typeof navigator.share ===
            "function" &&
          typeof navigator.canShare ===
            "function" &&
          navigator.canShare({
            files: [file],
          });

        if (canShareFiles) {
          try {
            await navigator.share({
              title:
                "HH Goa 2026 Builder Card",
              text: shareCaption,
              files: [file],
            });

            return;
          } catch (error) {
            /*
             * User cancelled the native share sheet.
             * Don't open another window in that case.
             */
            if (
              error instanceof DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.warn(
              "Native sharing failed. Falling back to X.",
              error
            );
          }
        }

        /*
         * Desktop / unsupported browser fallback.
         *
         * The browser cannot attach a locally-created
         * Blob directly to an X intent URL.
         *
         * Therefore download the real PNG first,
         * then open X with the caption ready.
         */
        const downloadUrl =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          downloadUrl;

        link.download =
          "HH-Goa-2026-Builder-Card.png";

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          downloadUrl
        );

        const xUrl =
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareCaption
          )}`;

        window.open(
          xUrl,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (error) {
        console.error(
          "Share failed:",
          error
        );

        alert(
          "We couldn't prepare your card for sharing. Please download it and share it manually."
        );
      } finally {
        setIsSharing(false);
      }
    };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ed] text-[#17251d]">
      {/* Decorative elements */}
      <div className="sun-decoration" />

      <div className="palm palm-one">
        🌴
      </div>

      <div className="palm palm-two">
        🌴
      </div>

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div>
          <div className="text-xl font-black tracking-tight">
            HH GOA
          </div>

          <div className="text-xs font-bold tracking-[0.3em]">
            2026
          </div>
        </div>

        <div className="hidden rounded-full border border-[#17251d]/20 bg-white/50 px-5 py-2 text-xs font-bold tracking-[0.2em] backdrop-blur-md md:block">
          BUILD • SHIP • CONNECT
        </div>

        <div className="rounded-full bg-[#17251d] px-5 py-2 text-xs font-bold text-white">
          BUILDER MODE
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#17251d]/15 bg-white/60 px-4 py-2 text-xs font-bold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#ef6c3d]" />

            YOUR BUILDER IDENTITY
          </div>

          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
            CREATE YOUR
            <br />

            <span className="text-[#ef6c3d]">
              BUILDER CARD.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-[#17251d]/60 md:text-base">
            Add your photo and a few
            details. Your builder identity
            updates live.
          </p>
        </div>

        {/* Creator */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Form */}
          <div>
            <PhotoUpload
              photo={photo}
              fileName={fileName}
              onUpload={handleUpload}
              onRemove={removePhoto}
            />

            <div className="mt-8">
              <BuilderForm
                name={name}
                role={role}
                stack={stack}
                builderTitle={
                  builderTitle
                }
                onNameChange={
                  setName
                }
                onRoleChange={
                  setRole
                }
                onStackChange={
                  setStack
                }
              />
            </div>
          </div>

          {/* Card */}
          <div>
            <BuilderCard
              photo={photo}
              name={name}
              role={role}
              stack={stack}
              builderTitle={
                builderTitle
              }
              photoPosition={
                photoPosition
              }
              onPhotoPositionChange={
                setPhotoPosition
              }
            />

            {/* Download */}
            <button
              type="button"
              onClick={
                generateCard
              }
              disabled={
                !photo ||
                !name ||
                !role ||
                !stack ||
                isGenerating ||
                isSharing
              }
              className="mx-auto mt-8 block w-full max-w-[520px] rounded-2xl bg-[#17251d] px-6 py-4 text-sm font-black text-white shadow-[5px_5px_0px_#ef6c3d] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#ef6c3d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating
                ? "CREATING YOUR CARD..."
                : "DOWNLOAD MY BUILDER CARD ↓"}
            </button>

            {/* Share to X */}
            <button
              type="button"
              onClick={
                shareToX
              }
              disabled={
                !photo ||
                !name ||
                !role ||
                !stack ||
                isGenerating ||
                isSharing
              }
              className="mx-auto mt-4 flex w-full max-w-[520px] items-center justify-center gap-3 rounded-2xl border-2 border-[#17251d] bg-white px-6 py-4 text-sm font-black text-[#17251d] shadow-[5px_5px_0px_#17251d] transition-all hover:-translate-y-0.5 hover:bg-[#17251d] hover:text-white hover:shadow-[7px_7px_0px_#ef6c3d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-lg">
                𝕏
              </span>

              {isSharing
                ? "PREPARING SHARE..."
                : "SHARE TO X"}
            </button>

            <p className="mx-auto mt-3 max-w-[520px] text-center text-[10px] leading-4 text-[#17251d]/40">
              On supported phones, your
              generated card is shared with
              the caption. Other browsers
              download the card and open X
              with the caption ready.
            </p>
          </div>
        </div>
      </section>

      {/* Hidden canvas */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Waves */}
      <div className="wave-decoration">
        <div />
        <div />
        <div />
      </div>

      {/* Footer */}
      <footer className="relative z-20 flex items-center justify-between px-6 pb-6 text-xs font-bold tracking-wider text-[#17251d]/50 md:px-10">
        <span>
          #FrameInGoa
        </span>

        <span>
          HH GOA 2026
        </span>
      </footer>
    </main>
  );
}