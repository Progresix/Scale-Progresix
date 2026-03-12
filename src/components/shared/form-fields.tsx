"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input as BaseInput } from "@/components/ui/input";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Input Component with Label and Error
 * Form input with integrated label and error message
 */
interface InputFieldProps extends FormFieldProps {
  className?: string;
  inputClassName?: string;
}

export const InputField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & InputFieldProps
>(({ label, error, helperText, required, className, inputClassName, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <BaseInput
        ref={ref}
        id={inputId}
        className={cn(
          "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          "focus:border-gray-900 dark:focus:border-gray-100",
          error && "border-red-500 dark:border-red-400 focus:border-red-500",
          inputClassName
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});
InputField.displayName = "InputField";

/**
 * Textarea Component with Label and Error
 */
interface TextareaFieldProps extends FormFieldProps {
  className?: string;
  textareaClassName?: string;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextareaFieldProps
>(({ label, error, helperText, required, className, textareaClassName, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <BaseTextarea
        ref={ref}
        id={inputId}
        className={cn(
          "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          "focus:border-gray-900 dark:focus:border-gray-100",
          error && "border-red-500 dark:border-red-400 focus:border-red-500",
          textareaClassName
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});
TextareaField.displayName = "TextareaField";

/**
 * Select Component with Label and Error
 */
interface SelectFieldProps extends FormFieldProps {
  className?: string;
  selectClassName?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & SelectFieldProps
>(
  (
    { label, error, helperText, required, className, selectClassName, options, placeholder, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={inputId} className="text-gray-900 dark:text-white">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors",
            "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-white",
            "focus:border-gray-900 dark:focus:border-gray-100 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:outline-none",
            error && "border-red-500 dark:border-red-400 focus:border-red-500",
            selectClassName
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
