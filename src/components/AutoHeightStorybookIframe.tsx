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
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const updateHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;
      const h = Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight ?? 0,
        minHeight
      );
      iframe.style.height = `${h}px`;
    } catch {
      // cross-origin이면 여기로 옴 — 높이 자동 조절 불가
    }
  }, [minHeight]);
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
    };
  }, []);
  const onLoad = () => {
    cleanupRef.current?.();
    cleanupRef.current = undefined;
    const iframe = iframeRef.current;
    if (!iframe) return;
    updateHeight();
    const doc = iframe.contentDocument;
    if (!doc?.documentElement) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight);
    });
    ro.observe(doc.documentElement);
    if (doc.body) ro.observe(doc.body);
    cleanupRef.current = () => {
      ro.disconnect();
    };
    // 폰트/이미지 로드 후 한 번 더
    requestAnimationFrame(() => updateHeight());
    setTimeout(updateHeight, 100);
  };
  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      width="100%"
      height={minHeight}
      onLoad={onLoad}
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