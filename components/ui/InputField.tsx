import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function InputField({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 glass rounded-xl text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextareaField({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: TextareaFieldProps) {
  const textareaId =
    id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-text mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-3 glass rounded-xl text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
}

