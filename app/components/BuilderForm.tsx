"use client";

type BuilderFormProps = {
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStackChange: (value: string) => void;
};

export default function BuilderForm({
  name,
  role,
  stack,
  builderTitle,
  onNameChange,
  onRoleChange,
  onStackChange,
}: BuilderFormProps) {
  return (
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
        {/* Name */}
        <div>
          <label
            htmlFor="builder-name"
            className="text-xs font-black tracking-[0.15em]"
          >
            YOUR NAME
          </label>

          <input
            id="builder-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Aditya Mangal"
            maxLength={30}
            className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
          />
        </div>

        {/* Role */}
        <div className="mt-5">
          <label
            htmlFor="builder-role"
            className="text-xs font-black tracking-[0.15em]"
          >
            WHAT DO YOU DO?
          </label>

          <input
            id="builder-role"
            type="text"
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            placeholder="e.g. Full Stack Developer"
            maxLength={35}
            className="mt-2 w-full rounded-2xl border-2 border-[#17251d]/15 bg-[#fff8ed] px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#ef6c3d]"
          />
        </div>

        {/* Stack */}
        <div className="mt-5">
          <label
            htmlFor="builder-stack"
            className="text-xs font-black tracking-[0.15em]"
          >
            YOUR STACK
          </label>

          <input
            id="builder-stack"
            type="text"
            value={stack}
            onChange={(e) => onStackChange(e.target.value)}
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
  );
}