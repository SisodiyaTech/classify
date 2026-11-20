import React from 'react';

const badgeVariants = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  accent: 'bg-amber-50 text-amber-900 border-amber-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  dark: 'bg-brand-900 text-white border-brand-950',
};

const badgeSizes = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
  md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  lg: 'text-sm px-3 py-1 rounded-lg font-medium',
};

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon: Icon
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 border shrink-0 ${badgeVariants[variant] || badgeVariants.neutral} ${badgeSizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
