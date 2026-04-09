import React, {useCallback, useEffect, useRef} from 'react';

export type AutoHeightStorybookIframeProps = {
  src: string;
  title: string;
  /** 초기/폴백 높이 (px) */
  minHeight?: number;
  style?: React.CSSProperties;
  className?: string;
};

export default function AutoHeightStorybookIframe({
  src,
  title,
  minHeight = 400,
  style,
  className,
}: AutoHeightStorybookIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  
  useEffect(() => {
    window.addEventListener('message', (event) => {
        const data = event.data;
        const iframe = iframeRef.current;
        if (!iframe) return;
        console.log('=============message', data.height);
        iframe.style.height = Number(data.height) + 'px';
    });

    return () => {
        window.removeEventListener('message', (event) => {});
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      width="100%"
      className={className}
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'block',
        ...style,
      }}
    />
  );
}