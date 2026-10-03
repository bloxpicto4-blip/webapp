import React, { useEffect, useRef, useState } from 'react';

/**
 * مؤشر مخصص لسطح المكتب فقط (Custom Desktop Cursor)
 * - يتحرك بنعومة عبر requestAnimationFrame
 * - يكبر عند المرور على الروابط والأزرار
 * - يعرض كلمة VIEW أو OPEN عند المرور على المشاريع
 * - يتوقف تلقائيًا على شاشات اللمس والموبايل أو عند تفعيل prefers-reduced-motion
 */
export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [cursorMode, setCursorMode] = useState<'default' | 'link' | 'project'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('VIEW');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // التحقق من أن الجهاز يدعم المؤشر الدقيق (Desktop) ولا يطلب تقليل الحركة
    const mediaFinePointer = window.matchMedia('(pointer: fine)');
    const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateAvailability = () => {
      setIsEnabled(mediaFinePointer.matches && !mediaReducedMotion.matches);
    };

    updateAvailability();
    mediaFinePointer.addEventListener('change', updateAvailability);
    mediaReducedMotion.addEventListener('change', updateAvailability);

    return () => {
      mediaFinePointer.removeEventListener('change', updateAvailability);
      mediaReducedMotion.removeEventListener('change', updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest('[data-cursor="project"]') as HTMLElement | null;
      if (projectEl) {
        setCursorMode('project');
        setCursorLabel(projectEl.getAttribute('data-cursor-label') || 'VIEW');
        return;
      }

      const interactiveEl = target.closest(
        'a, button, [role="button"], input, textarea, [data-cursor="link"]'
      );
      if (interactiveEl) {
        setCursorMode('link');
        return;
      }

      setCursorMode('default');
    };

    const renderLoop = () => {
      // حركة ناعمة للدائرة الخارجية (Lerp)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      // حركة سريعة للنقطة المركزية
      dotX += (mouseX - dotX) * 0.42;
      dotY += (mouseY - dotY) * 0.42;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* الدائرة الرئيسية المتفاعلة */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity] duration-200 ease-out will-change-transform ${
          cursorMode === 'project'
            ? 'h-20 w-20 bg-[#D9FF43] text-[#08090D] border border-[#D9FF43] shadow-[0_0_30px_rgba(217,255,67,0.45)]'
            : cursorMode === 'link'
            ? 'h-12 w-12 bg-[#D9FF43]/15 border border-[#D9FF43]/80 backdrop-blur-[2px]'
            : 'h-7 w-7 bg-transparent border border-[#F2F4F8]/35'
        }`}
      >
        {cursorMode === 'project' && (
          <span
            dir="ltr"
            className="font-mono-tech text-[11px] font-semibold tracking-[0.18em] text-[#08090D] select-none"
          >
            {cursorLabel}
          </span>
        )}
      </div>

      {/* النقطة الدقيقة في المركز */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-[#D9FF43] transition-opacity duration-150 will-change-transform ${
          cursorMode === 'project' ? 'opacity-0' : 'opacity-90'
        }`}
      />
    </div>
  );
};
