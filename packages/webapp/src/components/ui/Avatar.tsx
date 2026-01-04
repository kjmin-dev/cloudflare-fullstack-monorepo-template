import type { HTMLAttributes } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: AvatarSize;
  src?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ name, size = 'md', src, className = '', ...props }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          rounded-xl object-cover
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    );
  }

  return (
    <div
      className={`
        flex items-center justify-center
        bg-gradient-to-br from-violet-500 to-purple-600
        rounded-xl font-bold text-white
        shadow-lg shadow-violet-500/20 dark:shadow-black/30
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}>
      {initial}
    </div>
  );
}
