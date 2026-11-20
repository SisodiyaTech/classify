import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-subtle border border-transparent focus:ring-brand-500/20',
  secondary: 'bg-brand-700 hover:bg-brand-800 text-white shadow-subtle border border-transparent focus:ring-brand-700/20',
  accent: 'bg-accent hover:bg-accent-hover text-brand-950 font-semibold shadow-subtle border border-transparent focus:ring-accent/30',
  outline: 'bg-white hover:bg-surface-subtle text-brand-900 border border-edge hover:border-gray-300 focus:ring-brand-500/10',
  ghost: 'bg-transparent hover:bg-brand-50 text-content-body hover:text-brand-900 focus:ring-brand-500/10',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-subtle focus:ring-rose-500/20',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-subtle focus:ring-emerald-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-base font-medium rounded-xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!isLoading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
};
export default Button;
