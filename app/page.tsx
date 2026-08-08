"use client";

import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [stack, setStack] = useState("");

  const handleUpload = (file: File) => {
    if (!file) return;

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

    setFileName(file.name);

    const imageUrl = URL.createObjectURL(file);
    setPhoto(imageUrl);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleUpload(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            Add your photo and a few details.
            We will turn them into your HH Goa 2026
            builder identity.
          </p>
        </div>

        {/* Builder creator */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">

          {/* LEFT — Photo */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-[#ef6c3d]">
                  STEP 01
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Your photo
                </h2>
              </div>

              {photo && (
                <button
                  onClick={removePhoto}
                  className="text-xs font-bold text-[#17251d]/50 transition hover:text-[#ef6c3d]"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif"
              onChange={handleFileChange}
              className="hidden"
            />

            {!photo ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex min-h-[440px] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-[#17251d] bg-[#f7e6ca] p-8 text-center shadow-[8px_8px_0px_#17251d] transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#17251d]"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ef6c3d] text-4xl transition-transform duration-300 group-hover:rotate-12">
                  +
                </div>

                <h3 className="text-2xl font-black">
                  Upload your photo
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-[#17251d]/55">
                  Use a clear photo of yourself.
                  Portrait, landscape or square all work.
                </p>

                <div className="mt-6 rounded-full bg-[#17251d] px-5 py-2 text-xs font-bold text-white">
                  JPG • PNG • HEIC
                </div>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#17251d] bg-[#17251d] p-2 shadow-[8px_8px_0px_#ef6c3d]">
                <div className="relative h-[440px] overflow-hidden rounded-[1.5rem] bg-black">
                  <img
                    src={photo}
                    alt="Uploaded builder"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-20">
                    <p className="truncate text-xs font-bold text-white/70">
                      {fileName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black shadow-lg"
                >
                  Change photo
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Form */}
          <div>
            <div className="mb-3">
              <p className="text-xs font-black tracking-[0.2em] text-[#ef6c3d]">
                STEP 02
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Tell us about you
              </h2>
            </div>

            <div className="rounded-[2rem] border-2 border-[#17251d] bg-white p-6 shadow-[8px_8px_0px_#17251d] md:p-8">

              {/* Name */}
              <div>
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
              <div className="mt-6">
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
              <div className="mt-6">
                <label className="text-xs font-black tracking-[0.15em]">
                  YOUR STACK
                </label>

                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  placeholder="e.g. React • Node • Python"
                  maxLength={45}
                  className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
                />
              </div>

              {/* Builder title preview */}
              <div className="mt-7 rounded-2xl bg-[#f7e6ca] p-5">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#ef6c3d]">
                  YOUR BUILDER TITLE
                </p>

                <p className="mt-2 text-xl font-black">
                  {role
                    ? getBuilderTitle(role)
                    : "The Future Builder"}
                </p>

                <p className="mt-1 text-xs text-[#17251d]/50">
                  Generated from your role
                </p>
              </div>

              {/* Generate button */}
              <button
                disabled={!photo || !name || !role || !stack}
                className="mt-7 w-full rounded-2xl bg-[#ef6c3d] px-6 py-4 text-sm font-black text-white shadow-[5px_5px_0px_#17251d] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#17251d] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[5px_5px_0px_#17251d]"
              >
                GENERATE MY BUILDER CARD ↗
              </button>

              <p className="mt-4 text-center text-xs text-[#17251d]/40">
                No signup required • Your photo stays in your browser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom waves */}
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

/* Builder title generator */
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