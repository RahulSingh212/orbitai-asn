import { Input, Label, ErrorMessage } from "../atoms";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export const FormField = ({
  label,
  error,
  touched,
  required,
  id,
  ...inputProps
}: FormFieldProps) => {
  const showError = touched && error;

  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input id={id} hasError={!!showError} {...inputProps} />
      {showError && <ErrorMessage message={error} />}
    </div>
  );
};

