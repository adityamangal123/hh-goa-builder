"use client";

import { useRef, useState } from "react";
import heic2any from "heic2any";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [stack, setStack] = useState("");

 const handleUpload = async (file: File) => {
  if (!file) return;
  setIsProcessing(true);

  const fileName = file.name.toLowerCase();

  const isHEIC =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  const isSupportedImage =
    file.type === "image/jpeg" ||
    file.type === "image/png";

  if (!isHEIC && !isSupportedImage) {
    alert("Please upload a JPG, PNG or HEIC image.");
    return;
  }

  try {
    let imageBlob: Blob = file;

    /*
     * Convert HEIC/HEIF to JPEG
     */
    if (isHEIC) {
      imageBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      /*
       * heic2any can return Blob[] for some files
       */
      if (Array.isArray(imageBlob)) {
        imageBlob = imageBlob[0];
      }
    }

    /*
     * Remove previous object URL
     */
    if (photo) {
      URL.revokeObjectURL(photo);
    }

    /*
     * Create browser preview
     */
    const imageUrl = URL.createObjectURL(imageBlob);

    setPhoto(imageUrl);

    /*
     * Keep original filename for display
     */
    setFileName(file.name);
    setIsProcessing(false);
  } catch (error) {
    console.error("HEIC conversion failed:", error);

    alert(
      "We couldn't process this photo. Please try another image."
      setIsProcessing(false);
    );
  }
};


    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or HEIC image.");
      return;
    }

    if (photo) {
      URL.revokeObjectURL(photo);
    }

    const imageUrl = URL.createObjectURL(file);

    setPhoto(imageUrl);
    setFileName(file.name);
  };

 const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (file) {
    await handleUpload(file);
  }
};
  const removePhoto = () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }

    setPhoto(null);
    setFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

   const generateCard = async () => {
  if (!photo || !name || !role || !stack) {
    alert("Please complete your profile first.");
    return;
  }

  const canvas = canvasRef.current;

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const WIDTH = 1080;
  const HEIGHT = 1350;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  /*
   * Background
   */
  ctx.fillStyle = "#f7e6ca";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  /*
   * Helper: rounded rectangle
   */
  const roundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  };

  /*
   * Sun
   */
  ctx.fillStyle = "#f6b73c";
  ctx.beginPath();
  ctx.arc(900, 80, 210, 0, Math.PI * 2);
  ctx.fill();

  /*
   * Ocean shape
   */
  ctx.fillStyle = "#4ea8a1";
  ctx.beginPath();
  ctx.ellipse(180, 1370, 500, 180, 0, 0, Math.PI * 2);
  ctx.fill();

  /*
   * Photo area
   */
  const photoX = 90;
  const photoY = 190;
  const photoWidth = 900;
  const photoHeight = 620;

  // Photo shadow
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
  const image = new Image();

  image.src = photo;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject();
  });

  /*
   * Cover crop calculation
   */
  const imageRatio = image.width / image.height;
  const boxRatio = photoWidth / photoHeight;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > boxRatio) {
    sourceWidth = image.height * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / boxRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  /*
   * Clip photo into rounded rectangle
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
  ctx.strokeStyle = "#17251d";
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
  ctx.fillStyle = "#17251d";
  ctx.font = "900 42px Arial";

  ctx.fillText("HH GOA", 90, 80);

  ctx.font = "900 18px Arial";
  ctx.letterSpacing = "6px";
  ctx.fillText("2026", 95, 112);

  /*
   * Builder badge
   */
  ctx.fillStyle = "#17251d";

  roundedRect(
    820,
    55,
    170,
    55,
    28
  );

  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 17px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "BUILDER",
    905,
    90
  );

  ctx.textAlign = "left";

  /*
   * Name
   */
  ctx.fillStyle = "#17251d";

  const displayName =
    name.length > 22
      ? name.substring(0, 22)
      : name;

  ctx.font = "900 52px Arial";

  ctx.fillText(
    displayName.toUpperCase(),
    90,
    900
  );

  /*
   * Role
   */
  ctx.fillStyle = "#ef6c3d";

  ctx.font = "900 22px Arial";

  ctx.fillText(
    role.toUpperCase(),
    90,
    940
  );

  /*
   * Stack label
   */
  ctx.fillStyle = "#17251d";

  ctx.font = "900 13px Arial";

  ctx.fillText(
    "STACK",
    90,
    985
  );

  /*
   * Stack
   */
  const stackItems = getStackItems(stack);

  let stackX = 90;

  ctx.font = "700 16px Arial";

  stackItems.forEach((item) => {
    const textWidth = ctx.measureText(item).width;

    const pillWidth = textWidth + 30;

    ctx.fillStyle = "#ffffff";

    roundedRect(
      stackX,
      1005,
      pillWidth,
      40,
      20
    );

    ctx.fill();

    ctx.strokeStyle = "#17251d";
    ctx.lineWidth = 1;

    roundedRect(
      stackX,
      1005,
      pillWidth,
      40,
      20
    );

    ctx.stroke();

    ctx.fillStyle = "#17251d";

    ctx.fillText(
      item,
      stackX + 15,
      1031
    );

    stackX += pillWidth + 10;
  });

  /*
   * Builder title box
   */
  ctx.fillStyle = "#ef6c3d";

  roundedRect(
    90,
    1080,
    900,
    115,
    25
  );

  ctx.fill();

  ctx.fillStyle = "#ffffff";

  ctx.font = "900 13px Arial";

  ctx.fillText(
    "BUILDER TITLE",
    115,
    1110
  );

  ctx.font = "900 30px Arial";

  ctx.fillText(
    builderTitle,
    115,
    1155
  );

  /*
   * Footer
   */
  ctx.fillStyle = "#17251d";

  ctx.font = "900 14px Arial";

  ctx.fillText(
    "BUILD • SHIP • CONNECT",
    90,
    1260
  );

  ctx.font = "700 15px Arial";

  ctx.textAlign = "right";

  ctx.fillText(
    "#FrameInGoa",
    990,
    1260
  );

  ctx.textAlign = "left";

  /*
   * Download PNG
   */
  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "HH-Goa-2026-Builder-Card.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    },
    "image/png",
    1
  );
};

  const builderTitle = getBuilderTitle(role);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ed] text-[#17251d]">
      {/* Decorative elements */}
      <div className="sun-decoration" />
      <div className="palm palm-one">🌴</div>
      <div className="palm palm-two">🌴</div>

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

      {/* Heading */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10">
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
            Add your photo and a few details.
            Your builder identity updates live.
          </p>
        </div>

        {/* Creator */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT SIDE */}
          <div>
            <div className="mb-3">
              <p className="text-xs font-black tracking-[0.2em] text-[#ef6c3d]">
                BUILDER PROFILE
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Tell us about you
              </h2>
            </div>

            <div className="rounded-[2rem] border-2 border-[#17251d] bg-white p-6 shadow-[8px_8px_0px_#17251d] md:p-8">

              {/* Photo */}
              <div>
                <label className="text-xs font-black tracking-[0.15em]">
                  YOUR PHOTO
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/heic,image/heif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!photo ? (
                  <button
  disabled={isProcessing}
  onClick={() =>
    fileInputRef.current?.click()
  }
                   className="mt-3 flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#17251d]/25 bg-[#f7e6ca] transition hover:border-[#ef6c3d] hover:bg-[#f4dfbd] disabled:cursor-wait disabled:opacity-60"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef6c3d] text-3xl text-white">
                      +
                    </div>

                   <p className="mt-3 text-sm font-black">
  {isProcessing
    ? "Preparing your photo..."
    : "Upload your photo"}
</p>

<p className="mt-1 text-xs text-[#17251d]/50">
  {isProcessing
    ? "Just a moment"
    : "JPG • PNG • HEIC"}
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
                        onClick={removePhoto}
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

              {/* Name */}
              <div className="mt-6">
                <label className="text-xs font-black tracking-[0.15em]">
                  YOUR NAME
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditya Mangal"
                  maxLength={30}
                  className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
                />
              </div>

              {/* Role */}
              <div className="mt-5">
                <label className="text-xs font-black tracking-[0.15em]">
                  WHAT DO YOU DO?
                </label>

                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  maxLength={35}
                  className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
                />
              </div>

              {/* Stack */}
              <div className="mt-5">
                <label className="text-xs font-black tracking-[0.15em]">
                  YOUR STACK
                </label>

                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  placeholder="React • Node • MongoDB"
                  maxLength={45}
                  className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
                />
              </div>

              {/* Generated title */}
              <div className="mt-6 rounded-2xl bg-[#f7e6ca] p-5">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#ef6c3d]">
                  GENERATED BUILDER TITLE
                </p>

                <p className="mt-2 text-xl font-black">
                  {builderTitle}
                </p>

                <p className="mt-1 text-xs text-[#17251d]/50">
                  Based on your role
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — LIVE CARD */}
          <div>
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

            {/* CARD */}
            <div className="mx-auto max-w-[520px] rounded-[2rem] border-2 border-[#17251d] bg-white p-3 shadow-[10px_10px_0px_#ef6c3d]">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f7e6ca]">

                {/* Card background decorations */}
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f6b73c]" />

                <div className="absolute -bottom-20 -left-10 h-44 w-64 rounded-[50%] bg-[#4ea8a1] opacity-80" />

                <div className="absolute bottom-0 right-0 text-[110px] opacity-[0.08]">
                  🌴
                </div>

                {/* Card header */}
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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-[#17251d] bg-[#fff8ed] shadow-[5px_5px_0px_#17251d]">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Builder preview"
                        className="h-full w-full object-cover"
                      />
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

                {/* Card information */}
                <div className="relative z-10 p-6">

                  <div className="text-3xl font-black leading-none tracking-[-0.04em] md:text-4xl">
                    {name || "YOUR NAME"}
                  </div>

                  <div className="mt-2 text-xs font-black uppercase tracking-[0.15em] text-[#ef6c3d]">
                    {role || "YOUR ROLE"}
                  </div>

                  {/* Stack */}
                  <div className="mt-5">
                    <p className="text-[9px] font-black tracking-[0.2em] text-[#17251d]/40">
                      STACK
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {getStackItems(stack).map(
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

            {/* Generate button */}
            <button
              onClick={generateCard}
              disabled={!photo || !name || !role || !stack}
              className="mx-auto mt-8 block w-full max-w-[520px] rounded-2xl bg-[#17251d] px-6 py-4 text-sm font-black text-white shadow-[5px_5px_0px_#ef6c3d] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#ef6c3d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              GENERATE MY BUILDER CARD ↗
            </button>
          </div>
        </div>
      </section>

{/* Hidden canvas used for PNG generation */}
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
        <span>#FrameInGoa</span>
        <span>HH GOA 2026</span>
      </footer>
    </main>
  );
}

/* -----------------------------
   Builder title generator
----------------------------- */

function getBuilderTitle(role: string) {
  const value = role.toLowerCase();

  if (
    value.includes("ai") ||
    value.includes("machine learning") ||
    value.includes("ml")
  ) {
    return "The Machine Whisperer";
  }

  if (
    value.includes("frontend") ||
    value.includes("front-end") ||
    value.includes("ui")
  ) {
    return "The Pixel Architect";
  }

  if (
    value.includes("backend") ||
    value.includes("back-end")
  ) {
    return "The Systems Builder";
  }

  if (
    value.includes("full stack") ||
    value.includes("full-stack")
  ) {
    return "The Code Alchemist";
  }

  if (
    value.includes("designer") ||
    value.includes("design")
  ) {
    return "The Experience Crafter";
  }

  if (
    value.includes("cyber") ||
    value.includes("security")
  ) {
    return "The Digital Guardian";
  }

  if (
    value.includes("data") ||
    value.includes("analytics")
  ) {
    return "The Data Explorer";
  }

  if (
    value.includes("mobile") ||
    value.includes("android") ||
    value.includes("ios")
  ) {
    return "The Mobile Maker";
  }

  return "The Future Builder";
}

/* -----------------------------
   Stack formatting
----------------------------- */

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