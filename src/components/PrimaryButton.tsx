"use client";

export default function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition active:scale-[0.99] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
