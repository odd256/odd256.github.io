import React from 'react';

interface SimpleIconProps extends React.SVGProps<SVGSVGElement> {
  path: string;
  title?: string;
}

/**
 * 渲染来自 simple-icons 的图标组件
 */
export function SimpleIcon({ path, title, className, ...props }: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <path d={path} />
    </svg>
  );
}
