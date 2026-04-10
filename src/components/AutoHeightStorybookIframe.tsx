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
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type !== 'loaded') return;
      
      const iframe = iframeRef.current;
      if (!iframe) return;
      
      iframe.style.height = Number(data.height) + 'px';
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', overflow:'hidden'}}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        className={className}
        style={{
          overflow: 'hidden',
          display: 'block',
          ...style,
        }}
      />
    </div>
  );
}