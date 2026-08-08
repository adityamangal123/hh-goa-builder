"use client";

import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

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
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleUpload(file);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ed] text-[#17251d]">
      {/* Decorative sun */}
      <div className="sun-decoration" />

      {/* Decorative palm shapes */}
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

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center md:px-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#17251d]/15 bg-white/60 px-4 py-2 text-xs font-bold backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#ef6c3d]" />
          MADE FOR BUILDERS
        </div>

        <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.06em] md:text-8xl lg:text-[9rem]">
          BUILD
          <br />
          <span className="relative inline-block">
            IN GOA.
            <span className="absolute -right-5 -top-7 text-3xl md:-right-8 md:-top-10 md:text-5xl">
              ☀
            </span>
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-7 text-[#17251d]/65 md:text-lg">
          Create your HH Goa 2026 Builder Card.
          <br />
          Your photo. Your stack. Your builder identity.
        </p>

        {/* Upload card */}
        <div className="mt-10 w-full max-w-md">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-full overflow-hidden rounded-[2rem] border-2 border-[#17251d] bg-white p-2 text-left shadow-[8px_8px_0px_#17251d] transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#17251d] active:translate-y-1 active:shadow-[4px_4px_0px_#17251d]"
          >
            <div className="rounded-[1.5rem] border border-[#17251d]/10 bg-[#f7e6ca] px-7 py-8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xs font-black tracking-[0.2em] text-[#ef6c3d]">
                    {fileName ? "PHOTO SELECTED" : "STEP 01"}
                  </div>

                  <div className="mt-2 text-2xl font-black tracking-tight">
                    {fileName
                      ? "Ready to build."
                      : "Upload your photo"}
                  </div>

                  <div className="mt-2 text-sm text-[#17251d]/60">
                    {fileName
                      ? fileName
                      : "JPG • PNG • HEIC"}
                  </div>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ef6c3d] text-2xl transition-transform duration-300 group-hover:rotate-12">
                  {fileName ? "✓" : "↗"}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom info */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-bold tracking-wider text-[#17251d]/50">
          <span>NO SIGNUP</span>
          <span>•</span>
          <span>INSTANT</span>
          <span>•</span>
          <span>SHAREABLE</span>
        </div>
      </section>

      {/* Decorative wave */}
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