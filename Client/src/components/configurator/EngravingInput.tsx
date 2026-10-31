"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function EngravingInput({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
        Engraving
      </span>
      <input
        value={value}
        maxLength={16}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your initials"
        className="mt-2 w-full border border-line bg-void px-4 py-3 text-[14px] text-text outline-none placeholder:text-muted/60 focus:border-accent"
      />
      <span className="mt-1 block text-[14px] text-muted">{value.length}/16</span>
    </label>
  );
}
