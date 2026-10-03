/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_CONFIG, ProjectItem } from './config/siteContent';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroOrb3D } from './components/HeroOrb3D';
import { ProjectArtVisual } from './components/ProjectArtVisual';
import { CreatorSignature3D } from './components/CreatorSignature3D';
import {
  ProjectCaseStudyModal,
  QuickBriefModal,
} from './components/ProjectCaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const counterElRef = useRef<HTMLSpanElement | null>(null);

  // حالات التفاعل للمشاريع والنوافذ
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [activeMobileProjectId, setActiveMobileProjectId] = useState<string | null>('nexus');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [briefModalOpen, setBriefModalOpen] = useState<boolean>(false);
  const [activeProcessIndex, setActiveProcessIndex] = useState<number>(0);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const [pageTransitioning, setPageTransitioning] = useState<boolean>(false);

  // انتقال ناعم بين الأقسام عند الضغط على روابط الـ Navbar أو الأزرار
  const handleSmoothNavigate = (href: string) => {
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      targetEl.scrollIntoView({ behavior: 'auto' });
      return;
    }

    setPageTransitioning(true);
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 90);
    setTimeout(() => {
      setPageTransitioning(false);
    }, 480);
  };

  // نسخ البريد الإلكتروني بنقرة سريعة بجانب فتح البريد
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2400);
    } catch {
      // في حال عدم توفر الحافظة يفتح البريد مباشرة
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  };

  // تفعيل تأثيرات البطاقات على الموبايل عند التمرير (IntersectionObserver)
  useEffect(() => {
    const cards = document.querySelectorAll('[data-project-card-id]');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-project-card-id');
            if (id) setActiveMobileProjectId(id);
          }
        });
      },
      { threshold: 0.55 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  // إعداد حركات GSAP + ScrollTrigger للسرد البصري (Scroll Storytelling)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (counterElRef.current) {
        counterElRef.current.textContent = String(SITE_CONFIG.systemSection.counterTarget).padStart(
          2,
          '0'
        );
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. حركة ظهور عناصر الـ Hero السينمائية
      gsap.fromTo(
        '.hero-reveal-line',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.11,
          ease: 'power4.out',
          delay: 0.1,
        }
      );

      gsap.fromTo(
        '.hero-meta-reveal',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.5,
        }
      );

      // 2. حركة ظهور كلمات قسم المقدمة الفلسفية تدريجيًا مع التمرير (Intro Statement)
      gsap.fromTo(
        '.intro-word',
        { opacity: 0.16, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#intro-statement',
            start: 'top 78%',
            end: 'bottom 58%',
            scrub: 0.6,
          },
        }
      );

      // 3. حركة ظهور مشاريع SELECTED WORK
      gsap.utils.toArray<HTMLElement>('.project-poster-item').forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 64,
            opacity: 0,
            scale: 0.97,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
            delay: (index % 2) * 0.05,
          }
        );
      });

      // 4. العداد الرقمي الضخم من 00 إلى 10 في قسم 03 / THE SYSTEM
      const counterObj = { val: SITE_CONFIG.systemSection.counterStart };
      ScrollTrigger.create({
        trigger: '#system-counter-trigger',
        start: 'top 76%',
        once: true,
        onEnter: () => {
          gsap.to(counterObj, {
            val: SITE_CONFIG.systemSection.counterTarget,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => {
              if (counterElRef.current) {
                const rounded = Math.round(counterObj.val);
                counterElRef.current.textContent = String(rounded).padStart(2, '0');
              }
            },
          });
        },
      });

      // 5. ظهور مراحل العمل الأربعة بالتتابع (01 DISCOVER -> 04 BUILD)
      gsap.fromTo(
        '.process-stage-row',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#process-stages-list',
            start: 'top 80%',
          },
        }
      );

      // 6. حركة قسم عنّي (04 / ABOUT)
      gsap.fromTo(
        '.about-reveal',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 78%',
          },
        }
      );

      // 7. حركة قسم التايبوجرافي العملاق (MAKE IT MOVE.) أثناء التمرير
      gsap.fromTo(
        '#make-it-move-stack',
        { scale: 0.88, rotate: -2.2, y: 30 },
        {
          scale: 1.04,
          rotate: 1.2,
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: '#big-typography-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
          },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const introWordsLine1 = SITE_CONFIG.introStatement.bodyLine1.split(' ');
  const introWordsLine2 = SITE_CONFIG.introStatement.bodyLine2.split(' ');

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#08090D] text-[#F2F4F8]">
      {/* طبقة الحبيبات السينمائية الخفيفة */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* مؤشر سطح المكتب المخصص */}
      <CustomCursor />

      {/* حجاب الانتقال السلس بين الأقسام */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 bg-[#08090D] transition-opacity duration-300 ${
          pageTransitioning ? 'opacity-40' : 'opacity-0'
        }`}
      />

      {/* شريط التنقل الثابت */}
      <Navbar
        onNavigate={handleSmoothNavigate}
        onOpenBriefModal={() => setBriefModalOpen(true)}
      />

      {/* =====================================================================
          6 & 7. HERO SECTION + INTERACTIVE 3D METALLIC ORB
          ===================================================================== */}
      <main>
        <section
          id="hero"
          aria-label="القسم الرئيسي"
          className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-[#F2F4F8]/[0.07]"
        >
          {/* إضاءات خلفية محيطية هادئة */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 right-1/4 h-[460px] w-[460px] rounded-full bg-[#D9FF43]/[0.05] blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-10 h-[380px] w-[380px] rounded-full bg-[#1B1838]/60 blur-[110px]"
          />

          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* العمود الأيمن (في RTL): التايبوجرافي الضخم والزر الدائري */}
              <div className="lg:col-span-7 flex flex-col items-start text-right z-10">
                {/* سطر الهوية الإنجليزية المقصود + توقيع المصمم 3D */}
                <div
                  dir="ltr"
                  className="hero-meta-reveal mb-6 flex flex-wrap items-center gap-3 font-mono-tech text-xs tracking-[0.22em] text-[#9A9FA8]"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-[#D9FF43]" />
                  <span>{SITE_CONFIG.hero.tagEn}</span>
                  <span aria-hidden="true" className="text-[#D9FF43]/60">
                    ·
                  </span>
                  <a
                    href="#creator-3d-signature"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmoothNavigate('#creator-3d-signature');
                    }}
                    className="text-[#D9FF43] hover:text-[#F2F4F8] transition-colors font-semibold"
                  >
                    MADE BY ABDELRHMAN MOHAMED 3D
                  </a>
                </div>

                {/* العنوان السينمائي الرئيسي: "أحوّل الفكرة إلى تجربة." */}
                <h1 className="font-display-ar font-black text-[3.4rem] sm:text-[4.75rem] md:text-[5.6rem] xl:text-[6.6rem] leading-[1.03] tracking-tight mb-8 select-none">
                  <span className="hero-reveal-line block text-[#F2F4F8]">
                    {SITE_CONFIG.hero.headlineLine1}
                  </span>
                  <span className="hero-reveal-line block text-[#D9FF43] drop-shadow-[0_0_35px_rgba(217,255,67,0.22)]">
                    {SITE_CONFIG.hero.headlineAccent}
                  </span>
                  <span className="hero-reveal-line block text-[#F2F4F8]">
                    {SITE_CONFIG.hero.headlineLine3}{' '}
                    <span className="text-gradient-metallic">
                      {SITE_CONFIG.hero.headlineGradient}
                    </span>
                  </span>
                </h1>

                {/* Subtitle بنظام النصوص غير المؤطرة والفواصل الطباعية */}
                <p className="hero-meta-reveal font-display-ar text-base sm:text-lg md:text-xl font-semibold text-[#F2F4F8]/90 mb-4 tracking-wide">
                  {SITE_CONFIG.hero.subtitle}
                </p>

                {/* النص الوصفي المختصر */}
                <p className="hero-meta-reveal max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#9A9FA8] mb-10">
                  {SITE_CONFIG.hero.description}
                </p>

                {/* منطقة الزر الدائري التفاعلي والكلمات المفتاحية */}
                <div className="hero-meta-reveal flex flex-wrap items-center gap-8 sm:gap-12 w-full">
                  <a
                    href="#work"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmoothNavigate('#work');
                    }}
                    aria-label="شاهد الأعمال المختارة"
                    className="group relative flex h-32 w-32 sm:h-36 sm:w-36 flex-col items-center justify-center rounded-full border border-[#F2F4F8]/20 bg-[#10121A]/90 text-[#F2F4F8] transition-all duration-300 ease-out hover:scale-110 hover:-rotate-6 hover:border-[#D9FF43] hover:bg-[#D9FF43] hover:text-[#08090D] hover:shadow-[0_0_45px_rgba(217,255,67,0.4)] shrink-0"
                  >
                    <span className="font-display-ar text-xs sm:text-sm font-bold tracking-wide mb-1.5 whitespace-nowrap">
                      {SITE_CONFIG.hero.ctaButtonText}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-lg sm:text-xl font-mono-tech transition-transform duration-300 group-hover:translate-y-1.5"
                    >
                      ↓
                    </span>
                  </a>

                  {/* الكلمات الإنجليزية المقصودة كجزء من الهوية البصرية */}
                  <div
                    dir="ltr"
                    className="flex flex-wrap items-center gap-3 font-mono-tech text-xs tracking-[0.2em] text-[#525866]"
                  >
                    {SITE_CONFIG.hero.metaItems.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span className="hover:text-[#F2F4F8] transition-colors">
                          {item}
                        </span>
                        {idx < SITE_CONFIG.hero.metaItems.length - 1 && (
                          <span aria-hidden="true" className="text-[#D9FF43]/60">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* العمود الأيسر (في RTL): المجسم الكروي الثلاثي الأبعاد التفاعلي */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <HeroOrb3D />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            9. INTRO STATEMENT SECTION
            ===================================================================== */}
        <section
          id="intro-statement"
          aria-label="فلسفة التصميم والتجربة"
          className="relative py-28 sm:py-36 md:py-44 border-b border-[#F2F4F8]/[0.07] bg-[#0B0D12]"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div
              dir="ltr"
              className="mb-10 font-mono-tech text-xs tracking-[0.22em] text-[#D9FF43]"
            >
              {SITE_CONFIG.introStatement.sectionIndex}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
              {/* العنوان الضخم: "الموقع مش مجرد صفحة." */}
              <div className="lg:col-span-7">
                <h2 className="font-display-ar font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.08] tracking-tight text-balance">
                  <span className="block text-[#F2F4F8]">
                    {SITE_CONFIG.introStatement.headlinePart1}
                  </span>
                  <span className="block text-[#383D4B]">
                    {SITE_CONFIG.introStatement.headlineMutedWord}
                  </span>
                </h2>
              </div>

              {/* النص التوضيحي بجانب العنوان مع ظهور تدريجي للكلمات عند الـ Scroll */}
              <div className="lg:col-span-5 flex flex-col gap-6 border-r border-[#F2F4F8]/10 pr-6 sm:pr-8">
                <p className="font-display-ar text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-[#F2F4F8]">
                  {introWordsLine1.map((word, idx) => (
                    <span
                      key={`l1-${idx}`}
                      className="intro-word inline-block ml-2 text-[#D9FF43]"
                    >
                      {word}
                    </span>
                  ))}
                  <br />
                  {introWordsLine2.map((word, idx) => (
                    <span
                      key={`l2-${idx}`}
                      className="intro-word inline-block ml-2 text-[#F2F4F8]"
                    >
                      {word}
                    </span>
                  ))}
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-[#9A9FA8]">
                  {SITE_CONFIG.introStatement.supportingNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            10, 11, 12. SELECTED WORK SECTION (02 / SELECTED WORK)
            ===================================================================== */}
        <section
          id="work"
          aria-labelledby="selected-work-heading"
          className="relative py-28 sm:py-36 md:py-44 border-b border-[#F2F4F8]/[0.07] bg-[#08090D]"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            {/* رأس القسم */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
              <div>
                <div
                  dir="ltr"
                  className="mb-4 font-mono-tech text-xs tracking-[0.22em] text-[#D9FF43]"
                >
                  {SITE_CONFIG.selectedWork.sectionIndex}
                </div>
                <h2
                  id="selected-work-heading"
                  className="font-display-ar font-black text-4xl sm:text-6xl md:text-7xl leading-[1.06] tracking-tight text-[#F2F4F8]"
                >
                  <span className="block">{SITE_CONFIG.selectedWork.titleLine1}</span>
                  <span className="block text-[#9A9FA8]">
                    {SITE_CONFIG.selectedWork.titleLine2}
                  </span>
                </h2>
              </div>

              <p className="max-w-md text-sm sm:text-base text-[#9A9FA8] leading-relaxed">
                {SITE_CONFIG.selectedWork.subtitle}
              </p>
            </div>

            {/* قائمة المشاريع كـ Posters / Digital Art */}
            <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
              {SITE_CONFIG.selectedWork.projects.map((project, index) => {
                const isHovered =
                  hoveredProjectId === project.id ||
                  activeMobileProjectId === project.id;
                const isEven = index % 2 === 1;

                return (
                  <article
                    key={project.id}
                    data-project-card-id={project.id}
                    data-cursor="project"
                    data-cursor-label={index % 2 === 0 ? 'VIEW' : 'OPEN'}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`عرض دراسة حالة مشروع ${project.titleEn} - ${project.subtitleAr}`}
                    className={`project-poster project-poster-item group relative cursor-pointer overflow-hidden p-6 sm:p-10 lg:p-12 transition-all duration-500 ${
                      activeMobileProjectId === project.id ? 'is-active-mobile' : ''
                    }`}
                  >
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center`}
                    >
                      {/* اللوحة البصرية التفاعلية (Abstract Visual Poster) */}
                      <div
                        className={`lg:col-span-7 h-[290px] sm:h-[380px] md:h-[430px] w-full overflow-hidden border border-[#F2F4F8]/10 relative ${
                          isEven ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <ProjectArtVisual
                          visualType={project.visualType}
                          isHovered={isHovered}
                        />

                        {/* شريط علوي داخل البوستر */}
                        <div
                          dir="ltr"
                          className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between font-mono-tech text-[11px] tracking-[0.18em] text-[#F2F4F8]/80"
                        >
                          <span>{project.number} / POSTER ART</span>
                          <span className="text-[#D9FF43]">{project.year}</span>
                        </div>
                      </div>

                      {/* تفاصيل المشروع (الرقم، الاسم، الوصف، السهم الدوار) */}
                      <div
                        className={`lg:col-span-5 flex flex-col justify-between gap-6 ${
                          isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-[#F2F4F8]/10 pb-4">
                          <span
                            dir="ltr"
                            className="font-mono-tech text-sm font-semibold tracking-[0.2em] text-[#D9FF43] tabular-nums"
                          >
                            {project.number} / 03
                          </span>
                          <span
                            dir="ltr"
                            className="font-mono-tech text-xs tracking-[0.14em] text-[#9A9FA8]"
                          >
                            {project.categoryEn}
                          </span>
                        </div>

                        <div className="transition-transform duration-500 ease-out group-hover:-translate-x-2">
                          <h3
                            dir="ltr"
                            className="font-display-en text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F2F4F8] group-hover:text-[#D9FF43] transition-colors text-right mb-3"
                          >
                            {project.titleEn}
                          </h3>
                          <p className="font-display-ar text-lg sm:text-xl font-bold text-[#F2F4F8]/90 mb-3">
                            {project.subtitleAr}
                          </p>
                          <p className="text-sm sm:text-base leading-relaxed text-[#9A9FA8]">
                            {project.descriptionAr}
                          </p>
                        </div>

                        {/* المخرجات مع فواصل طباعية نظيفة */}
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center justify-end gap-2 font-mono-tech text-[11px] tracking-[0.14em] text-[#525866] pt-2"
                        >
                          {project.deliverables.map((del, dIdx) => (
                            <React.Fragment key={del}>
                              <span className="group-hover:text-[#9A9FA8] transition-colors">
                                {del}
                              </span>
                              {dIdx < project.deliverables.length - 1 && (
                                <span aria-hidden="true" className="text-[#D9FF43]/60">
                                  ·
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {/* زر استكشاف المشروع والسهم الدوار */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#F2F4F8]/[0.07]">
                          <span className="text-xs sm:text-sm font-semibold text-[#F2F4F8] group-hover:text-[#D9FF43] transition-colors">
                            استكشف دراسة الحالة
                          </span>
                          <span
                            aria-hidden="true"
                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#F2F4F8]/15 bg-[#08090D] font-mono-tech text-lg text-[#F2F4F8] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#D9FF43] group-hover:bg-[#D9FF43] group-hover:text-[#08090D]"
                          >
                            ↖
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            13 & 14. NUMBERS & PROCESS SECTION (03 / THE SYSTEM)
            ===================================================================== */}
        <section
          id="system"
          aria-labelledby="system-heading"
          className="relative py-28 sm:py-36 md:py-44 border-b border-[#F2F4F8]/[0.07] bg-[#0B0D12]"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div
              dir="ltr"
              className="mb-12 font-mono-tech text-xs tracking-[0.22em] text-[#D9FF43]"
            >
              {SITE_CONFIG.systemSection.sectionIndex}
            </div>

            {/* منطقة الرقم الضخم المتحرك (00 -> 10) */}
            <div
              id="system-counter-trigger"
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pb-20 sm:pb-28 border-b border-[#F2F4F8]/10"
            >
              <div className="lg:col-span-5 flex items-baseline justify-start lg:justify-center">
                <div
                  dir="ltr"
                  className="font-mono-tech font-semibold text-[7.5rem] sm:text-[10.5rem] md:text-[13rem] leading-none tracking-tighter text-[#D9FF43] tabular-nums select-none"
                >
                  <span ref={counterElRef}>00</span>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-6">
                <h2
                  id="system-heading"
                  className="font-display-ar font-black text-4xl sm:text-6xl md:text-7xl leading-[1.06] text-[#F2F4F8]"
                >
                  <span className="block">{SITE_CONFIG.systemSection.headlineLine1}</span>
                  <span className="block text-[#9A9FA8]">
                    {SITE_CONFIG.systemSection.headlineLine2}
                  </span>
                </h2>

                {/* مسار العمل: "بحث → فكرة → تصميم → حركة → تطوير → إطلاق." */}
                <p className="font-display-ar text-lg sm:text-xl md:text-2xl font-semibold text-[#D9FF43] tracking-wide pt-2">
                  {SITE_CONFIG.systemSection.flowText}
                </p>
              </div>
            </div>

            {/* 14. PROCESS: المراحل الأربعة بأسلوب Editorial تفاعلي */}
            <div id="process-stages-list" className="pt-16 sm:pt-24">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#9A9FA8]">
                  منهجية العمل التحريرية (Editorial Process)
                </span>
                <span dir="ltr" className="font-mono-tech text-xs text-[#525866]">
                  01 — 04 STAGES
                </span>
              </div>

              <div className="divide-y divide-[#F2F4F8]/10 border-t border-b border-[#F2F4F8]/10">
                {SITE_CONFIG.systemSection.processStages.map((stage, idx) => {
                  const isExpanded = activeProcessIndex === idx;
                  return (
                    <div
                      key={stage.number}
                      onClick={() => setActiveProcessIndex(idx)}
                      onMouseEnter={() => setActiveProcessIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveProcessIndex(idx);
                        }
                      }}
                      className="process-stage-row group py-8 sm:py-10 transition-colors duration-300 cursor-pointer"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                        {/* رقم واسم المرحلة بالإنجليزية */}
                        <div
                          dir="ltr"
                          className="md:col-span-4 flex items-baseline gap-4 text-right md:text-left"
                        >
                          <span
                            className={`font-mono-tech text-sm sm:text-base font-semibold tabular-nums transition-colors ${
                              isExpanded ? 'text-[#D9FF43]' : 'text-[#525866]'
                            }`}
                          >
                            {stage.number}
                          </span>
                          <span
                            className={`font-display-en text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
                              isExpanded
                                ? 'text-[#F2F4F8]'
                                : 'text-[#9A9FA8] group-hover:text-[#F2F4F8]'
                            }`}
                          >
                            {stage.titleEn}
                          </span>
                        </div>

                        {/* العنوان العربي للمرحلة */}
                        <div className="md:col-span-3">
                          <h3 className="font-display-ar text-xl sm:text-2xl font-bold text-[#F2F4F8] group-hover:text-[#D9FF43] transition-colors">
                            {stage.titleAr}
                          </h3>
                        </div>

                        {/* الوصف التحريري والمخرجات */}
                        <div className="md:col-span-5 flex flex-col gap-2">
                          <p className="text-sm sm:text-base leading-relaxed text-[#9A9FA8]">
                            {stage.descriptionAr}
                          </p>
                          <span className="font-mono-tech text-xs text-[#D9FF43]/80 pt-1">
                            {stage.deliverableAr}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            15. ABOUT SECTION (04 / ABOUT)
            ===================================================================== */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="relative py-28 sm:py-36 md:py-44 border-b border-[#F2F4F8]/[0.07] bg-[#08090D]"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div
              dir="ltr"
              className="about-reveal mb-8 font-mono-tech text-xs tracking-[0.22em] text-[#D9FF43]"
            >
              {SITE_CONFIG.aboutSection.sectionIndex}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 sm:mb-28">
              <div className="lg:col-span-7 about-reveal">
                <h2
                  id="about-heading"
                  className="font-display-ar font-black text-4xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight text-[#F2F4F8] text-balance"
                >
                  <span className="block">{SITE_CONFIG.aboutSection.headlineLine1}</span>
                  <span className="block text-[#D9FF43]">
                    {SITE_CONFIG.aboutSection.headlineLine2}
                  </span>
                </h2>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6 about-reveal">
                <p className="font-display-ar text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-[#F2F4F8]">
                  {SITE_CONFIG.aboutSection.description}
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#9A9FA8]">
                  {SITE_CONFIG.aboutSection.secondaryParagraph}
                </p>
              </div>
            </div>

            {/* الإحصائيات الثلاثة (06 مراحل العمل | 03 أنواع مشاريع | ∞ أفكار جديدة) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 border-t border-[#F2F4F8]/10 pt-14">
              {SITE_CONFIG.aboutSection.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="about-reveal flex flex-col justify-between border-r border-[#F2F4F8]/10 pr-6 sm:pr-8"
                >
                  <span
                    dir="ltr"
                    className="font-mono-tech text-xs tracking-[0.18em] text-[#525866] mb-4"
                  >
                    {stat.detailEn}
                  </span>
                  <div
                    dir="ltr"
                    className="font-mono-tech text-6xl sm:text-7xl md:text-8xl font-semibold text-[#F2F4F8] tabular-nums leading-none mb-4 text-right"
                  >
                    {stat.value}
                  </div>
                  <div className="font-display-ar text-lg sm:text-xl font-bold text-[#D9FF43]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            16. BIG TYPOGRAPHY SECTION (#D9FF43 — MAKE IT MOVE.)
            ===================================================================== */}
        <section
          id="big-typography-section"
          aria-label="Make It Move Statement"
          className="relative overflow-hidden bg-[#D9FF43] text-[#08090D] py-28 sm:py-36 md:py-48 select-none"
        >
          {/* خطوط هندسية رفيعة في الخلفية */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex justify-between px-8 opacity-15"
          >
            <div className="h-full w-[1px] bg-[#08090D]" />
            <div className="h-full w-[1px] bg-[#08090D]" />
            <div className="h-full w-[1px] bg-[#08090D]" />
          </div>

          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 text-center relative z-10">
            <div
              id="make-it-move-stack"
              dir="ltr"
              className="font-display-en font-extrabold text-[4.4rem] sm:text-[7.5rem] md:text-[10rem] lg:text-[12.5rem] leading-[0.88] tracking-tighter uppercase will-change-transform"
            >
              <span className="block text-[#08090D]">
                {SITE_CONFIG.bigTypography.word1}
              </span>
              <span className="block text-stroke-dark">
                {SITE_CONFIG.bigTypography.word2}
              </span>
              <span className="block text-[#08090D]">
                {SITE_CONFIG.bigTypography.word3}
              </span>
            </div>

            <p className="mt-10 font-display-ar text-base sm:text-lg md:text-xl font-bold text-[#08090D]/85 max-w-xl mx-auto">
              {SITE_CONFIG.bigTypography.captionAr}
            </p>
          </div>
        </section>

        {/* =====================================================================
            17. CONTACT SECTION (عندك فكرة؟ خلينا نبنيها.)
            ===================================================================== */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="relative py-28 sm:py-36 md:py-44 bg-[#08090D] border-b border-[#F2F4F8]/[0.08]"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div
              dir="ltr"
              className="mb-8 font-mono-tech text-xs tracking-[0.22em] text-[#D9FF43]"
            >
              {SITE_CONFIG.contactSection.sectionIndex}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-7">
                <h2
                  id="contact-heading"
                  className="font-display-ar font-black text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-[#F2F4F8] mb-6"
                >
                  <span className="block">{SITE_CONFIG.contactSection.headlineLine1}</span>
                  <span className="block text-[#9A9FA8]">
                    {SITE_CONFIG.contactSection.headlineLine2}
                  </span>
                  <span className="block text-[#D9FF43]">
                    {SITE_CONFIG.contactSection.headlineLine3}
                  </span>
                </h2>

                <p className="max-w-lg text-sm sm:text-base text-[#9A9FA8] leading-relaxed">
                  {SITE_CONFIG.contactSection.subtextAr}
                </p>
              </div>

              {/* البريد الإلكتروني القابل للنقر مع خط متحرك وسهم */}
              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end gap-6">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  dir="ltr"
                  className="group inline-flex items-center gap-4 text-2xl sm:text-3xl md:text-4xl font-mono-tech font-semibold text-[#F2F4F8] hover:text-[#D9FF43] transition-colors"
                >
                  <span className="editorial-underline">{SITE_CONFIG.email}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 text-[#D9FF43]"
                  >
                    ↗
                  </span>
                </a>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setBriefModalOpen(true)}
                    className="bg-[#D9FF43] text-[#08090D] hover:bg-[#e5ff70] font-display-ar font-bold text-sm px-6 py-3 transition-transform active:scale-95 whitespace-nowrap shrink-0"
                  >
                    أرسل ملخص مشروعك الآن ↗
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="border border-[#F2F4F8]/15 bg-[#10121A] hover:border-[#D9FF43] text-xs font-mono-tech text-[#9A9FA8] hover:text-[#F2F4F8] px-4 py-3 transition-colors whitespace-nowrap shrink-0"
                  >
                    {emailCopied ? 'COPIED ✓' : 'COPY EMAIL'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3D CREATOR SIGNATURE MONUMENT (MADE BY ABDELRHMAN MOHAMED 3D)
            ===================================================================== */}
        <CreatorSignature3D />
      </main>

      {/* =====================================================================
          18. FOOTER
          ===================================================================== */}
      <footer className="bg-[#08090D] py-10 sm:py-12">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div
            dir="ltr"
            className="flex items-center gap-3 font-mono-tech text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#F2F4F8]"
          >
            <span>{SITE_CONFIG.footer.brand}</span>
            <span aria-hidden="true" className="text-[#D9FF43]">
              ·
            </span>
            <span className="text-[#D9FF43]">MADE BY ABDELRHMAN MOHAMED</span>
          </div>

          <div
            dir="ltr"
            className="font-mono-tech text-xs tracking-[0.16em] text-[#525866] text-center"
          >
            {SITE_CONFIG.footer.copyright}
          </div>

          <button
            type="button"
            onClick={() => handleSmoothNavigate('#hero')}
            dir="ltr"
            aria-label="العودة إلى أعلى الصفحة"
            className="group inline-flex items-center gap-2 font-mono-tech text-xs tracking-[0.18em] text-[#9A9FA8] hover:text-[#D9FF43] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{SITE_CONFIG.footer.backToTop}</span>
          </button>
        </div>
      </footer>

      {/* نوافذ العرض التفاعلية لدراسة الحالة وبدء مشروع جديد */}
      <ProjectCaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <QuickBriefModal
        isOpen={briefModalOpen}
        onClose={() => setBriefModalOpen(false)}
      />
    </div>
  );
}
