import React, { useEffect, useRef, useState } from 'react';

/**
 * عنصر ثلاثي الأبعاد تفاعلي في قسم الـ Hero (Hero 3D Metallic Orb)
 * - كرة معدنية داكنة ومستقبلية مع انعكاسات ضوئية وتوهج أخضر داخلي (#D9FF43)
 * - تتفاعل في الوقت الحقيقي مع حركة الماوس ومع التمرير (Scroll)
 * - تتوقف تلقائيًا عند خروجها من الشاشة عبر IntersectionObserver للحفاظ على الأداء
 */
export const HeroOrb3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [interactivePulse, setInteractivePulse] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 520;
    let height = 520;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(280, Math.min(rect.width || 460, 560));
      height = width;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // إحداثيات الماوس والتمرير
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollFactor = 0;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = nx;
      targetMouseY = ny;
    };

    const handleScroll = () => {
      scrollFactor = Math.min(window.scrollY / 800, 1.5);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // نقاط الشبكة الهندسية على سطح الكرة الثلاثية الأبعاد
    const latitudes = 11;
    const longitudes = 22;
    const nodes: { lat: number; lon: number; radiusOffset: number }[] = [];

    for (let i = 1; i < latitudes; i++) {
      const lat = (i / latitudes) * Math.PI - Math.PI / 2;
      for (let j = 0; j < longitudes; j++) {
        const lon = (j / longitudes) * Math.PI * 2;
        nodes.push({
          lat,
          lon,
          radiusOffset: Math.sin(i * 2.1 + j * 1.3) * 0.03,
        });
      }
    }

    const drawFrame = () => {
      if (!isVisible) return;

      currentMouseX += (targetMouseX - currentMouseX) * 0.07;
      currentMouseY += (targetMouseY - currentMouseY) * 0.07;
      if (!prefersReducedMotion) {
        time += 0.0085;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + currentMouseX * 14;
      const cy = height / 2 + currentMouseY * 14 - scrollFactor * 18;
      const baseRadius = width * 0.34;

      // 1. الهالة الخضراء الخلفية (Internal & Ambient Lime Glow)
      const outerGlow = ctx.createRadialGradient(
        cx - currentMouseX * 18,
        cy - currentMouseY * 18,
        baseRadius * 0.15,
        cx,
        cy,
        baseRadius * 1.42
      );
      outerGlow.addColorStop(0, 'rgba(217, 255, 67, 0.24)');
      outerGlow.addColorStop(0.45, 'rgba(109, 74, 255, 0.10)');
      outerGlow.addColorStop(1, 'rgba(8, 9, 13, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.42, 0, Math.PI * 2);
      ctx.fill();

      // 2. الجسم المعدني المظلم للكرة (Dark Metallic Core Sphere)
      const lightX = cx - baseRadius * 0.35 + currentMouseX * 36;
      const lightY = cy - baseRadius * 0.38 + currentMouseY * 36;

      const metalGrad = ctx.createRadialGradient(
        lightX,
        lightY,
        baseRadius * 0.05,
        cx,
        cy,
        baseRadius
      );
      metalGrad.addColorStop(0, '#2B3142');
      metalGrad.addColorStop(0.28, '#151924');
      metalGrad.addColorStop(0.68, '#0A0C12');
      metalGrad.addColorStop(0.92, '#06070A');
      metalGrad.addColorStop(1, '#1E2514');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = metalGrad;
      ctx.fill();

      // 3. التوهج الداخلي الأخضر النيون (Internal Energy Core)
      const coreX = cx + Math.sin(time * 1.4) * 10 - currentMouseX * 20;
      const coreY = cy + Math.cos(time * 1.1) * 10 - currentMouseY * 20;
      const innerCoreGrad = ctx.createRadialGradient(
        coreX,
        coreY,
        2,
        cx,
        cy,
        baseRadius * 0.85
      );
      innerCoreGrad.addColorStop(0, 'rgba(217, 255, 67, 0.55)');
      innerCoreGrad.addColorStop(0.35, 'rgba(217, 255, 67, 0.14)');
      innerCoreGrad.addColorStop(0.75, 'rgba(27, 24, 56, 0.18)');
      innerCoreGrad.addColorStop(1, 'rgba(8, 9, 13, 0)');

      ctx.fillStyle = innerCoreGrad;
      ctx.fill();

      // 4. حساب وتوقيع النقاط الثلاثية الأبعاد على سطح الكرة
      const rotY = time * 0.8 + currentMouseX * 0.65 + scrollFactor * 0.9;
      const rotX = 0.35 + currentMouseY * 0.45 + scrollFactor * 0.4;

      const projectedNodes: { x: number; y: number; z: number; alpha: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = baseRadius * (1 + Math.sin(time * 2 + i) * 0.008 + n.radiusOffset);

        const x0 = r * Math.cos(n.lat) * Math.sin(n.lon + rotY);
        const y0 = r * Math.sin(n.lat);
        const z0 = r * Math.cos(n.lat) * Math.cos(n.lon + rotY);

        // دوران حول المحور X
        const y1 = y0 * Math.cos(rotX) - z0 * Math.sin(rotX);
        const z1 = y0 * Math.sin(rotX) + z0 * Math.cos(rotX);

        const depthNorm = (z1 + baseRadius) / (2 * baseRadius); // 0 -> 1
        projectedNodes.push({
          x: cx + x0,
          y: cy + y1,
          z: z1,
          alpha: Math.max(0.06, Math.pow(depthNorm, 1.8)),
        });
      }

      // رسم خطوط المدارات الهندسية الدقيقة
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projectedNodes.length; i++) {
        const p1 = projectedNodes[i];
        if (p1.z < -baseRadius * 0.25) continue;

        const nextInRow =
          (i + 1) % longitudes === 0 ? i - longitudes + 1 : i + 1;
        const p2 = projectedNodes[nextInRow];

        if (p2 && p2.z > -baseRadius * 0.25) {
          ctx.strokeStyle = `rgba(217, 255, 67, ${p1.alpha * 0.22})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // رسم نقاط اللمعان المعدنية والخضراء
      for (let i = 0; i < projectedNodes.length; i++) {
        const p = projectedNodes[i];
        if (p.z < -baseRadius * 0.4) continue;
        const isAccentNode = i % 5 === 0;
        const dotSize = isAccentNode ? 2.1 * p.alpha : 1.2 * p.alpha;

        ctx.fillStyle = isAccentNode
          ? `rgba(217, 255, 67, ${Math.min(1, p.alpha * 1.15)})`
          : `rgba(242, 244, 248, ${p.alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. حافة الانعكاس المعدني (Metallic Rim Reflection)
      ctx.strokeStyle = 'rgba(217, 255, 67, 0.38)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius - 0.5, -0.7 + currentMouseX * 0.3, 1.4 + currentMouseY * 0.3);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(242, 244, 248, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius - 0.5, 2.1, 4.3);
      ctx.stroke();

      ctx.restore();

      // 6. حلقات مدارية خارجية ثلاثية الأبعاد (Futuristic Orbital Rings)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.38 + currentMouseX * 0.12 + scrollFactor * 0.25);
      ctx.scale(1, 0.34 + currentMouseY * 0.04);

      ctx.strokeStyle = 'rgba(217, 255, 67, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.26, 0, Math.PI * 2);
      ctx.stroke();

      // قمر مداري صغير يتحرك على الحلقة
      const satAngle = time * 1.5;
      const satX = Math.cos(satAngle) * baseRadius * 1.26;
      const satY = Math.sin(satAngle) * baseRadius * 1.26;
      ctx.fillStyle = '#D9FF43';
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // الحلقة المدارية الثانية المائلة
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.62 - currentMouseY * 0.1);
      ctx.scale(1, 0.26);
      ctx.strokeStyle = 'rgba(242, 244, 248, 0.11)';
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    // إيقاف الحركة عندما يكون العنصر خارج الشاشة لتحقيق أعلى أداء
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(rafId);
            drawFrame();
          } else {
            cancelAnimationFrame(rafId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    drawFrame();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={() => setInteractivePulse((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setInteractivePulse((prev) => !prev);
        }
      }}
      aria-label="مجسم كروي معدني ثلاثي الأبعاد يتفاعل مع حركة المؤشر والتمرير"
      className={`relative flex items-center justify-center w-full max-w-[480px] lg:max-w-[540px] aspect-square mx-auto select-none transition-transform duration-500 ${
        interactivePulse ? 'scale-[1.04]' : 'scale-100'
      }`}
    >
      {/* هالة ضوئية خلفية ناعمة */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-10 rounded-full transition-opacity duration-700 ${
          interactivePulse ? 'opacity-95' : 'opacity-65'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(217, 255, 67, 0.16) 0%, rgba(27, 24, 56, 0.22) 55%, rgba(8, 9, 13, 0) 75%)',
          filter: 'blur(28px)',
        }}
      />

      {/* لوحة الرسم الثلاثية الأبعاد */}
      <canvas
        ref={canvasRef}
        className="relative z-10 block max-w-full h-auto"
      />

      {/* إحداثيات بصرية هادئة حول المجسم */}
      <div
        dir="ltr"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-[11px] tracking-[0.18em] text-[#525866]"
      >
        <span>CORE / METALLIC ORB</span>
        <span className="text-[#D9FF43]/80">INTERACTIVE 3D</span>
      </div>
    </div>
  );
};
