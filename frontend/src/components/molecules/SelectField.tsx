import { Select, Label, ErrorMessage } from "../atoms";
import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: ReactNode;
}

export const SelectField = ({
  label,
  error,
  touched,
  required,
  id,
  children,
  ...selectProps
}: SelectFieldProps) => {
  const showError = touched && error;

  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Select id={id} hasError={!!showError} {...selectProps}>
        {children}
      </Select>
      {showError && <ErrorMessage message={error} />}
    </div>
  );
};

