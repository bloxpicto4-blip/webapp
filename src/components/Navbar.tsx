import React, { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../config/siteContent';

interface NavbarProps {
  onNavigate: (href: string) => void;
  onOpenBriefModal: () => void;
}

/**
 * شريط التنقل العلوي الثابت (Navbar) + قائمة الموبايل بملء الشاشة
 * يلتزم بعقد المناطق الثلاث (Brand | Links | Primary Action)
 */
export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenBriefModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('work');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);

      // تحديث القسم النشط أثناء التمرير
      const sections = ['work', 'system', 'about', 'contact'];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (const secId of sections) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(secId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // منع تمرير الخلفية عند فتح قائمة الموبايل
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08090D]/80 backdrop-blur-md border-b border-[#F2F4F8]/[0.08] py-3.5'
            : 'bg-transparent py-5 md:py-6 border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Zone 1: Brand Title (Single text element) */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            dir="ltr"
            className="font-mono-tech text-sm md:text-base font-semibold tracking-[0.2em] text-[#F2F4F8] hover:text-[#D9FF43] transition-colors duration-200 whitespace-nowrap shrink-0"
            aria-label="العودة إلى الأعلى - LEVEL / 01"
          >
            {SITE_CONFIG.brandMark}
          </a>

          {/* Zone 2: Center Navigation Links (Desktop) */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-9 lg:gap-11"
          >
            {SITE_CONFIG.navLinks.slice(0, 3).map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`group relative py-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#F2F4F8]' : 'text-[#9A9FA8] hover:text-[#F2F4F8]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 right-0 h-[1.5px] bg-[#D9FF43] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action (Desktop) & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onOpenBriefModal();
              }}
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#F2F4F8] hover:text-[#D9FF43] transition-colors duration-200 whitespace-nowrap shrink-0 group"
            >
              <span className="editorial-underline">{SITE_CONFIG.ctaLabel}</span>
            </a>

            {/* زر القائمة في الموبايل */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="fullscreen-mobile-menu"
              aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="md:hidden inline-flex h-11 px-3.5 items-center justify-center gap-2.5 border border-[#F2F4F8]/15 bg-[#10121A]/80 text-[#F2F4F8] hover:border-[#D9FF43] transition-colors duration-200 whitespace-nowrap shrink-0"
            >
              <span dir="ltr" className="font-mono-tech text-[11px] tracking-[0.18em]">
                {menuOpen ? 'CLOSE' : 'MENU'}
              </span>
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span
                  className={`block h-[1.5px] w-full bg-[#D9FF43] transition-transform duration-300 ${
                    menuOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full bg-[#F2F4F8] transition-opacity duration-200 ${
                    menuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full bg-[#D9FF43] transition-transform duration-300 ${
                    menuOpen ? '-translate-y-[5.5px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* القائمة السينمائية الكاملة للموبايل (Fullscreen Mobile Menu) */}
      <div
        id="fullscreen-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="قائمة الموقع"
        className={`fixed inset-0 z-30 bg-[#08090D]/98 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col justify-between px-6 pt-28 pb-10 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div
            dir="ltr"
            className="font-mono-tech text-xs tracking-[0.22em] text-[#525866] border-b border-[#F2F4F8]/10 pb-3"
          >
            NAVIGATION / 2026
          </div>

          <nav className="flex flex-col gap-4" aria-label="روابط الموبايل">
            {[
              { id: 'work', num: '01', label: 'الأعمال', en: 'SELECTED WORK', href: '#work' },
              { id: 'system', num: '02', label: 'النظام', en: 'THE SYSTEM', href: '#system' },
              { id: 'about', num: '03', label: 'عنّي', en: 'ABOUT', href: '#about' },
              { id: 'contact', num: '04', label: 'ابدأ مشروعًا', en: 'CONTACT', href: '#contact' },
            ].map((item, idx) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                style={{ transitionDelay: menuOpen ? `${idx * 60}ms` : '0ms' }}
                className={`group flex items-baseline justify-between border-b border-[#F2F4F8]/[0.07] py-4 transition-all duration-500 ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    dir="ltr"
                    className="font-mono-tech text-xs text-[#D9FF43] tabular-nums"
                  >
                    {item.num}
                  </span>
                  <span className="font-display-ar text-3xl font-bold text-[#F2F4F8] group-hover:text-[#D9FF43] transition-colors">
                    {item.label}
                  </span>
                </div>
                <span
                  dir="ltr"
                  className="font-mono-tech text-[11px] tracking-[0.16em] text-[#525866] group-hover:text-[#F2F4F8]"
                >
                  {item.en} ↗
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#F2F4F8]/10 pt-6">
          <div className="flex items-center justify-between text-xs text-[#9A9FA8]">
            <span>تواصل مباشر</span>
            <span dir="ltr" className="font-mono-tech text-[#D9FF43]">
              AVAILABLE FOR 2026
            </span>
          </div>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            dir="ltr"
            className="font-mono-tech text-lg text-[#F2F4F8] hover:text-[#D9FF43] transition-colors"
          >
            {SITE_CONFIG.email}
          </a>
        </div>
      </div>
    </>
  );
};
