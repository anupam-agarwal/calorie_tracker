import React, { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const Form: React.FC<FormProps> = ({ children, ...props }) => (
  <form className="space-y-6" {...props}>
    {children}
  </form>
);

Form.displayName = 'Form';
