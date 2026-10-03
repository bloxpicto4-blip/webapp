import React, { useEffect, useRef } from 'react';

interface ProjectArtVisualProps {
  visualType: 'nexus' | 'timebox' | 'arcade';
  isHovered: boolean;
}

/**
 * مولد اللوحات الفنية التجريدية للمشاريع الثلاثة (Abstract Procedural Visuals)
 * - NEXUS: نظام مستقبلي أخضر ليموني / أسود مع عقد شبكية متزامنة
 * - TIMEBOX: كبسولات زمنية وحلقات ذاكرة بنفسجية عميقة / سوداء
 * - ARCADE: شبكة منظور مظلمة مع نقطة طاقة نيون خضراء متحركة
 */
export const ProjectArtVisual: React.FC<ProjectArtVisualProps> = ({
  visualType,
  isHovered,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = false;
    let t = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 640;
    let h = 420;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      w = Math.max(300, rect.width || 600);
      h = Math.max(260, rect.height || 400);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      if (!isVisible) return;

      const speedMultiplier = isHovered ? 2.2 : 1;
      if (!prefersReducedMotion) {
        t += 0.012 * speedMultiplier;
      }

      ctx.clearRect(0, 0, w, h);

      if (visualType === 'nexus') {
        // NEXUS: Abstract Green/Black Futuristic System
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#070A09');
        bgGrad.addColorStop(0.5, '#0C1410');
        bgGrad.addColorStop(1, '#08090D');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // توهج مركزي أخضر
        const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, w * 0.52);
        glow.addColorStop(0, 'rgba(217, 255, 67, 0.22)');
        glow.addColorStop(0.5, 'rgba(217, 255, 67, 0.05)');
        glow.addColorStop(1, 'rgba(8, 9, 13, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // دوائر وموجات نظام رقمي متداخلة
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let r = 1; r <= 6; r++) {
          const radius = r * (Math.min(w, h) * 0.075) + Math.sin(t + r) * 4;
          ctx.strokeStyle =
            r % 2 === 0 ? 'rgba(217, 255, 67, 0.34)' : 'rgba(242, 244, 248, 0.08)';
          ctx.lineWidth = r === 3 ? 1.6 : 1;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, t * (r % 2 === 0 ? 0.5 : -0.4), t + Math.PI * 1.55);
          ctx.stroke();
        }

        // خطوط مسار بيانات هندسية
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 0.25;
          const x1 = cx + Math.cos(angle) * 28;
          const y1 = cy + Math.sin(angle) * 28;
          const x2 = cx + Math.cos(angle) * (Math.min(w, h) * 0.44);
          const y2 = cy + Math.sin(angle) * (Math.min(w, h) * 0.44);

          ctx.strokeStyle = 'rgba(217, 255, 67, 0.16)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // نبضة متحركة على الخط
          const pulseDist = 28 + ((t * 45 + i * 24) % (Math.min(w, h) * 0.38));
          const px = cx + Math.cos(angle) * pulseDist;
          const py = cy + Math.sin(angle) * pulseDist;
          ctx.fillStyle = '#D9FF43';
          ctx.beginPath();
          ctx.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (visualType === 'timebox') {
        // TIMEBOX: Purple/Black Memory System
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#090812');
        bgGrad.addColorStop(0.55, '#16112C');
        bgGrad.addColorStop(1, '#08090D');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 15, w * 0.5, h * 0.5, w * 0.55);
        glow.addColorStop(0, 'rgba(157, 123, 255, 0.28)');
        glow.addColorStop(0.55, 'rgba(217, 255, 67, 0.06)');
        glow.addColorStop(1, 'rgba(8, 9, 13, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // طبقات زمنية متموجة (Memory Capsules / Temporal Frames)
        const cx = w * 0.5;
        const cy = h * 0.5;
        const layers = 7;
        for (let i = 0; i < layers; i++) {
          const offset = Math.sin(t * 0.9 + i * 0.6) * 14;
          const rectW = w * (0.22 + i * 0.08);
          const rectH = h * (0.18 + i * 0.08);
          ctx.save();
          ctx.translate(cx + offset * 0.6, cy - offset * 0.4);
          ctx.rotate(Math.sin(t * 0.3 + i * 0.2) * 0.12);
          ctx.strokeStyle =
            i === 2
              ? 'rgba(217, 255, 67, 0.55)'
              : `rgba(157, 123, 255, ${0.42 - i * 0.045})`;
          ctx.lineWidth = i === 2 ? 1.5 : 1;
          ctx.strokeRect(-rectW / 2, -rectH / 2, rectW, rectH);
          ctx.restore();
        }

        // محور الزمن المركزي
        ctx.fillStyle = '#D9FF43';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // ARCADE: Dark Perspective Grid + Neon Green Point
        ctx.fillStyle = '#07080C';
        ctx.fillRect(0, 0, w, h);

        const horizonY = h * 0.36;

        // خطوط الشبكة الأفقية والعمودية ذات المنظور (Perspective Grid)
        ctx.strokeStyle = 'rgba(242, 244, 248, 0.08)';
        ctx.lineWidth = 1;

        const numCols = 14;
        for (let i = -numCols; i <= numCols; i++) {
          const topX = w * 0.5 + i * (w * 0.025);
          const bottomX = w * 0.5 + i * (w * 0.11);
          ctx.beginPath();
          ctx.moveTo(topX, horizonY);
          ctx.lineTo(bottomX, h);
          ctx.stroke();
        }

        const gridProgress = (t * 0.45) % 1;
        for (let r = 0; r < 10; r++) {
          const p = (r + gridProgress) / 10;
          const y = horizonY + Math.pow(p, 1.85) * (h - horizonY);
          ctx.strokeStyle = `rgba(217, 255, 67, ${p * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // نقطة الطاقة النيون الخضراء المركزية (Neon Green Energy Point)
        const pointX = w * 0.5 + Math.sin(t * 1.3) * (w * 0.14);
        const pointY = horizonY + Math.cos(t * 0.9) * 18;

        const neonGlow = ctx.createRadialGradient(pointX, pointY, 2, pointX, pointY, 95);
        neonGlow.addColorStop(0, 'rgba(217, 255, 67, 0.95)');
        neonGlow.addColorStop(0.22, 'rgba(217, 255, 67, 0.35)');
        neonGlow.addColorStop(1, 'rgba(217, 255, 67, 0)');

        ctx.fillStyle = neonGlow;
        ctx.beginPath();
        ctx.arc(pointX, pointY, 95, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#D9FF43';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(rafId);
            render();
          } else {
            cancelAnimationFrame(rafId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(wrapper);
    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [visualType, isHovered]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden bg-[#08090D]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      {/* طبقة تباين سينمائية ناعمة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-[#08090D]/40"
      />
    </div>
  );
};
