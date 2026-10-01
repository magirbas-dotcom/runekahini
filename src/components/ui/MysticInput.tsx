import type { InputHTMLAttributes } from "react";

type MysticInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Text/number field as a writing tablet sunk into the slate (.inscription),
 * the same treatment as the question field. Native number
 * spinners are stripped globally in index.css — these are plain numeric
 * entries, not steppers.
 */
export default function MysticInput({ className = "", ...rest }: MysticInputProps) {
  return (
    <input
      className={`inscription h-14 text-center ${className}`}
      {...rest}
    />
  );
}
