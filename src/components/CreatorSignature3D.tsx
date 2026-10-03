import React, { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '../config/siteContent';

type MaterialMode = 'lime' | 'chrome' | 'wireframe';

/**
 * مجسم التوقيع الثلاثي الأبعاد (3D Creator Signature Monument)
 * يعرض "MADE BY ABDELRHMAN MOHAMED" بتقنية الطبقات الثلاثية الأبعاد الحقيقية (CSS 3D Extrusion + Interactive 3D Canvas)
 * يتفاعل مع حركة الماوس واللمس ويسمح بتغيير خامة العرض الثلاثي الأبعاد
 */
export const CreatorSignature3D: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const card3DRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [material, setMaterial] = useState<MaterialMode>('lime');
  const [autoOrbit, setAutoOrbit] = useState<boolean>(true);

  useEffect(() => {
    const stage = stageRef.current;
    const card = card3DRef.current;
    const glare = glareRef.current;
    const canvas = canvasRef.current;
    if (!stage || !card || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let targetRotX = 8;
    let targetRotY = -12;
    let currentRotX = 8;
    let currentRotY = -12;
    let isPointerInside = false;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 800;
    let h = 380;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      w = Math.max(300, rect.width || 800);
      h = Math.max(260, rect.height || 380);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      const normX = (relX - 0.5) * 2; // -1 to 1
      const normY = (relY - 0.5) * 2; // -1 to 1

      isPointerInside = true;
      targetRotY = normX * 22;
      targetRotX = -normY * 16;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${relX * 100}% ${
          relY * 100
        }%, rgba(217, 255, 67, 0.22) 0%, rgba(255, 255, 255, 0.06) 35%, transparent 70%)`;
      }
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
    };

    stage.addEventListener('pointermove', handlePointerMove, { passive: true });
    stage.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // إنشاء شبكة النجوم المدارية الثلاثية الأبعاد خلف التوقيع
    const rings = 3;
    const pointsPerRing = 28;

    const animate = () => {
      if (!isVisible) return;

      if (!prefersReducedMotion) {
        time += 0.014;
      }

      if (!isPointerInside && autoOrbit && !prefersReducedMotion) {
        targetRotY = Math.sin(time * 0.85) * 14;
        targetRotX = Math.cos(time * 0.65) * 8;
      }

      currentRotX += (targetRotX - currentRotX) * 0.09;
      currentRotY += (targetRotY - currentRotY) * 0.09;

      if (card) {
        card.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(
          2
        )}deg)`;
      }

      // رسم الفضاء الهندسي الثلاثي الأبعاد في الخلفية
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;

      // خطوط محورية ثلاثية الأبعاد تستجيب للدوران
      ctx.save();
      ctx.translate(cx, cy);

      for (let r = 1; r <= rings; r++) {
        const rx = Math.min(w * 0.42, 420) * (r / rings);
        const ry = rx * 0.32;
        const tilt = (currentRotY * 0.012) + (r % 2 === 0 ? 0.18 : -0.18);

        ctx.save();
        ctx.rotate(tilt);
        ctx.strokeStyle =
          r === 2 ? 'rgba(217, 255, 67, 0.22)' : 'rgba(242, 244, 248, 0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        for (let p = 0; p < pointsPerRing; p++) {
          const angle = (p / pointsPerRing) * Math.PI * 2 + time * (r % 2 === 0 ? 0.35 : -0.25);
          const px = Math.cos(angle) * rx;
          const py = Math.sin(angle) * ry;
          if (p % 7 === 0) {
            ctx.fillStyle = '#D9FF43';
            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      ctx.restore();

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(rafId);
            animate();
          } else {
            cancelAnimationFrame(rafId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(stage);
    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [autoOrbit]);

  const textClass =
    material === 'lime'
      ? 'text-3d-lime'
      : material === 'chrome'
      ? 'text-3d-chrome'
      : 'text-3d-wireframe';

  return (
    <section
      id="creator-3d-signature"
      aria-label="Made by Abdelrhman Mohamed 3D Signature"
      className="relative bg-[#08090D] py-20 sm:py-28 border-b border-[#F2F4F8]/[0.08] overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* شريط التحكم العلوي للمنصة الثلاثية الأبعاد */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div dir="ltr" className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.2em] text-[#9A9FA8]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#D9FF43]" />
            <span>3D SPATIAL SIGNATURE</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D9FF43]">INTERACTIVE MONUMENT</span>
          </div>

          {/* أزرار تبديل خامة الـ 3D وتشغيل الدوران التلقائي */}
          <div dir="ltr" className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'lime', label: 'LIME 3D' },
                { id: 'chrome', label: 'METALLIC 3D' },
                { id: 'wireframe', label: 'WIREFRAME 3D' },
              ] as { id: MaterialMode; label: string }[]
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMaterial(mode.id)}
                className={`px-3.5 py-1.5 font-mono-tech text-[11px] tracking-[0.15em] border transition-colors whitespace-nowrap shrink-0 ${
                  material === mode.id
                    ? 'border-[#D9FF43] bg-[#D9FF43] text-[#08090D] font-semibold'
                    : 'border-[#F2F4F8]/15 bg-[#10121A] text-[#9A9FA8] hover:text-[#F2F4F8] hover:border-[#F2F4F8]/35'
                }`}
              >
                {mode.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setAutoOrbit((prev) => !prev)}
              className={`px-3.5 py-1.5 font-mono-tech text-[11px] tracking-[0.15em] border transition-colors whitespace-nowrap shrink-0 ${
                autoOrbit
                  ? 'border-[#D9FF43]/50 bg-[#10121A] text-[#D9FF43]'
                  : 'border-[#F2F4F8]/15 bg-[#0B0D12] text-[#525866] hover:text-[#9A9FA8]'
              }`}
            >
              {autoOrbit ? 'ORBIT: ON' : 'ORBIT: PAUSED'}
            </button>
          </div>
        </div>

        {/* المسرح الثلاثي الأبعاد (3D Stage) */}
        <div
          ref={stageRef}
          data-cursor="project"
          data-cursor-label="3D TILT"
          className="scene-3d-perspective relative w-full min-h-[320px] sm:min-h-[390px] flex items-center justify-center border border-[#F2F4F8]/12 bg-gradient-to-b from-[#10121A] via-[#0B0D12] to-[#08090D] overflow-hidden p-6 sm:p-12 select-none"
        >
          {/* خلفية المدارات الثلاثية الأبعاد */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          {/* إضاءة انعكاس ديناميكية تتبع الماوس */}
          <div
            ref={glareRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          />

          {/* الكتلة الثلاثية الأبعاد متعددة الطبقات (Preserved-3D Extruded Block) */}
          <div
            ref={card3DRef}
            dir="ltr"
            className="preserve-3d relative z-10 flex flex-col items-center justify-center text-center py-8 px-6 sm:px-14 will-change-transform"
          >
            {/* طبقة الظل العميقة على المحور Z الخلفي */}
            <div
              aria-hidden="true"
              style={{ transform: 'translateZ(-42px)' }}
              className="pointer-events-none absolute inset-0 rounded-none border border-[#D9FF43]/15 bg-[#050608]/90 shadow-[0_35px_90px_rgba(0,0,0,0.95)]"
            />

            {/* إطار هندسي عائم في المستوى الأوسط */}
            <div
              aria-hidden="true"
              style={{ transform: 'translateZ(-14px)' }}
              className="pointer-events-none absolute -inset-2 sm:-inset-4 border border-[#F2F4F8]/10"
            />

            {/* شارة MADE BY العائمة للأمام على المحور Z */}
            <div
              style={{ transform: 'translateZ(28px)' }}
              className="mb-4 inline-flex items-center gap-3 border border-[#D9FF43]/60 bg-[#08090D]/90 px-4 py-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.65)]"
            >
              <span className="h-2 w-2 rounded-full bg-[#D9FF43] animate-pulse" />
              <span className="font-mono-tech text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#D9FF43]">
                {SITE_CONFIG.creator.prefixEn}
              </span>
            </div>

            {/* الاسم الثلاثي الأبعاد البارز: ABDELRHMAN MOHAMED */}
            <div className="relative preserve-3d">
              {/* طبقات العمق الخلفية لإعطاء سماكة ثلاثية الأبعاد حقيقية عند الإمالة */}
              {[18, 12, 6].map((depth) => (
                <div
                  key={depth}
                  aria-hidden="true"
                  style={{ transform: `translateZ(-${depth}px)` }}
                  className="pointer-events-none absolute inset-0 font-display-en font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-[#D9FF43]/20 select-none"
                >
                  <span className="block">ABDELRHMAN</span>
                  <span className="block">MOHAMED</span>
                </div>
              ))}

              {/* الطبقة الأمامية البارزة على المحور Z */}
              <h2
                style={{ transform: 'translateZ(44px)' }}
                className={`font-display-en font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] transition-all duration-300 ${textClass}`}
              >
                <span className="block">ABDELRHMAN</span>
                <span className="block text-[#D9FF43]">MOHAMED</span>
              </h2>
            </div>

            {/* السطر العربي والتقني البارز */}
            <div
              style={{ transform: 'translateZ(32px)' }}
              className="mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#9A9FA8]"
            >
              <span className="font-display-ar font-bold text-[#F2F4F8]">
                تصميم وتطوير: {SITE_CONFIG.creator.nameAr}
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-[#D9FF43]">
                ·
              </span>
              <span className="font-mono-tech text-[11px] tracking-[0.2em] text-[#D9FF43]">
                {SITE_CONFIG.creator.roleEn}
              </span>
            </div>
          </div>

          {/* إحداثيات الزوايا */}
          <div
            dir="ltr"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono-tech text-[10px] tracking-[0.18em] text-[#525866]"
          >
            <span>Z-AXIS DEPTH · 44PX</span>
            <span>MOVE CURSOR TO ROTATE 3D</span>
          </div>
        </div>
      </div>
    </section>
  );
};
