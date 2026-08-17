import type { InputHTMLAttributes } from "react";

type MysticInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Text/number field styled to the app's surface language. Native number
 * spinners are stripped globally in index.css — these are plain numeric
 * entries, not steppers.
 */
export default function MysticInput({ className = "", ...rest }: MysticInputProps) {
  return (
    <input
      className={`h-14 w-full rounded-2xl border border-hairline bg-ink-soft/70 px-4 text-center text-base text-parchment transition duration-200 placeholder:text-parchment-mute focus:border-gold focus:bg-surface focus:outline-none ${className}`}
      {...rest}
    />
  );
}
