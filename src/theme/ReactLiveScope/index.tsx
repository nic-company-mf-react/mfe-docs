import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Demo Button – mfe-lib-shared가 설치되면 아래 import로 교체
// import { Button } from '@nic/mfe-lib-shared/components';
// ─────────────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#2563eb',
    color: '#fff',
    border: '1px solid #2563eb',
  },
  secondary: {
    background: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
  },
  destructive: {
    background: '#dc2626',
    color: '#fff',
    border: '1px solid #dc2626',
  },
  outline: {
    background: 'transparent',
    color: '#2563eb',
    border: '1px solid #2563eb',
  },
  ghost: {
    background: 'transparent',
    color: '#1e293b',
    border: '1px solid transparent',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 12px', fontSize: '12px', borderRadius: '4px' },
  md: { padding: '8px 20px', fontSize: '14px', borderRadius: '6px' },
  lg: { padding: '12px 28px', fontSize: '16px', borderRadius: '8px' },
};

function Button({
  children = 'Button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : hovered ? 0.85 : 1,
    transition: 'opacity 0.15s ease, transform 0.1s ease',
    transform: hovered && !disabled ? 'translateY(-1px)' : 'none',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
  };

  return (
    <button
      style={base}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReactLiveScope: live 코드블록에서 사용할 수 있는 모든 심볼
// ─────────────────────────────────────────────────────────────────────────────
const ReactLiveScope = {
  React,
  ...React,
  Button,
};

export default ReactLiveScope;
