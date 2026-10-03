import React, { useEffect, useState } from 'react';
import { ProjectItem, SITE_CONFIG } from '../config/siteContent';
import { ProjectArtVisual } from './ProjectArtVisual';

interface ProjectCaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

/**
 * نافذة عرض تفاصيل المشروع (Interactive Case Study Lightbox)
 * تفتح عند الضغط على أي مشروع لعرض التحدي والمعمارية والنتائج بشكل تفصيلي
 */
export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090D]/90 backdrop-blur-xl p-4 sm:p-6 md:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-4xl border border-[#F2F4F8]/15 bg-[#0B0D12] p-6 sm:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* الشريط العلوي للنافذة */}
        <div className="flex items-center justify-between border-b border-[#F2F4F8]/10 pb-5 mb-8">
          <div dir="ltr" className="flex items-center gap-3 font-mono-tech text-xs text-[#9A9FA8]">
            <span className="text-[#D9FF43] tabular-nums">{project.number}</span>
            <span>·</span>
            <span>{project.categoryEn}</span>
            <span>·</span>
            <span className="tabular-nums">{project.year}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق تفاصيل المشروع"
            className="inline-flex items-center gap-2 border border-[#F2F4F8]/15 bg-[#10121A] px-4 py-2 text-xs font-mono-tech text-[#F2F4F8] hover:border-[#D9FF43] hover:text-[#D9FF43] transition-colors whitespace-nowrap shrink-0"
          >
            <span>إغلاق</span>
            <span dir="ltr">ESC ✕</span>
          </button>
        </div>

        {/* اللوحة البصرية والعنوان */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-6 h-64 sm:h-72 border border-[#F2F4F8]/10 overflow-hidden">
            <ProjectArtVisual visualType={project.visualType} isHovered={true} />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <h3
              id="case-study-title"
              dir="ltr"
              className="font-display-en text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F2F4F8] text-right"
            >
              {project.titleEn}
            </h3>
            <p className="font-display-ar text-xl font-semibold text-[#D9FF43]">
              {project.subtitleAr}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#9A9FA8]">
              {project.descriptionAr}
            </p>

            {/* المخرجات كـ نص نظيف بدون كبسولات */}
            <div
              dir="ltr"
              className="pt-2 font-mono-tech text-xs text-[#9A9FA8] flex flex-wrap items-center gap-2 justify-end"
            >
              {project.deliverables.map((item, i) => (
                <React.Fragment key={item}>
                  <span>{item}</span>
                  {i < project.deliverables.length - 1 && (
                    <span aria-hidden="true" className="text-[#D9FF43]">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* تفاصيل دراسة الحالة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#F2F4F8]/10 pt-8">
          <div className="flex flex-col gap-2">
            <span dir="ltr" className="font-mono-tech text-xs text-[#D9FF43] tracking-wider">
              01. CHALLENGE
            </span>
            <h4 className="font-display-ar text-base font-bold text-[#F2F4F8]">التحدي</h4>
            <p className="text-sm leading-relaxed text-[#9A9FA8]">
              {project.caseStudyDetails.challenge}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span dir="ltr" className="font-mono-tech text-xs text-[#D9FF43] tracking-wider">
              02. ARCHITECTURE
            </span>
            <h4 className="font-display-ar text-base font-bold text-[#F2F4F8]">البنية والحركة</h4>
            <p className="text-sm leading-relaxed text-[#9A9FA8]">
              {project.caseStudyDetails.architecture}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span dir="ltr" className="font-mono-tech text-xs text-[#D9FF43] tracking-wider">
              03. IMPACT
            </span>
            <h4 className="font-display-ar text-base font-bold text-[#F2F4F8]">الأثر الرقمي</h4>
            <p className="text-sm leading-relaxed text-[#9A9FA8]">
              {project.caseStudyDetails.outcome}
            </p>
            <p className="mt-1 font-mono-tech text-xs text-[#D9FF43] tabular-nums">
              {project.metricsAr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * نافذة بدء مشروع جديد السريعة (Interactive Project Brief Modal)
 */
export const QuickBriefModal: React.FC<QuickBriefModalProps> = ({ isOpen, onClose }) => {
  const [selectedScope, setSelectedScope] = useState<string>('تجربة ويب تفاعلية شاملة');
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scopes = [
    'تجربة ويب تفاعلية شاملة',
    'نظام تصميم وهوية رقمية',
    'تطوير واجهات وحركة (Creative Dev)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent(`مشروع جديد: ${selectedScope} — ${name || 'عميل'}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\nنوع المشروع: ${selectedScope}\n\nتفاصيل الفكرة:\n${details}`
    );
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090D]/90 backdrop-blur-xl p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl border border-[#F2F4F8]/15 bg-[#0B0D12] p-6 sm:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#F2F4F8]/10 pb-4 mb-6">
          <span dir="ltr" className="font-mono-tech text-xs tracking-[0.2em] text-[#D9FF43]">
            START A PROJECT / 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-mono-tech text-xs text-[#9A9FA8] hover:text-[#F2F4F8] px-2 py-1"
          >
            ESC ✕
          </button>
        </div>

        <h3
          id="brief-modal-title"
          className="font-display-ar text-2xl sm:text-3xl font-bold text-[#F2F4F8] mb-2"
        >
          خلينا نحول فكرتك إلى تجربة.
        </h3>
        <p className="text-sm text-[#9A9FA8] mb-6">
          اختر مسار المشروع أو راسلني مباشرة عبر{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            dir="ltr"
            className="font-mono-tech text-[#D9FF43] underline"
          >
            {SITE_CONFIG.email}
          </a>
        </p>

        {submitted ? (
          <div className="border border-[#D9FF43]/40 bg-[#10121A] p-6 text-center">
            <p className="font-display-ar text-lg font-bold text-[#D9FF43] mb-2">
              تم تجهيز رسالتك بنجاح
            </p>
            <p className="text-sm text-[#9A9FA8] mb-5">
              تم فتح تطبيق البريد الإلكتروني لديك لإرسال التفاصيل إلى {SITE_CONFIG.email}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-[#D9FF43] text-[#08090D] font-bold text-sm px-6 py-2.5"
            >
              إغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-[#9A9FA8] mb-2">مجال المشروع</label>
              <div className="grid grid-cols-1 gap-2">
                {scopes.map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setSelectedScope(scope)}
                    className={`text-right px-4 py-2.5 text-xs sm:text-sm border transition-colors ${
                      selectedScope === scope
                        ? 'border-[#D9FF43] bg-[#D9FF43]/10 text-[#F2F4F8] font-semibold'
                        : 'border-[#F2F4F8]/10 bg-[#10121A] text-[#9A9FA8] hover:border-[#F2F4F8]/30'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="client-name" className="block text-xs text-[#9A9FA8] mb-1.5">
                الاسم أو الجهة
              </label>
              <input
                id="client-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: استوديو أفق / أحمد"
                className="w-full border border-[#F2F4F8]/15 bg-[#10121A] px-4 py-2.5 text-sm text-[#F2F4F8] placeholder-[#525866] focus:border-[#D9FF43] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="project-details" className="block text-xs text-[#9A9FA8] mb-1.5">
                ملخص الفكرة والهدف
              </label>
              <textarea
                id="project-details"
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="ما التجربة التي تطمح لبنائها؟"
                className="w-full border border-[#F2F4F8]/15 bg-[#10121A] px-4 py-2.5 text-sm text-[#F2F4F8] placeholder-[#525866] focus:border-[#D9FF43] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#9A9FA8] hover:text-[#F2F4F8] px-4 py-2"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-[#D9FF43] text-[#08090D] hover:bg-[#e5ff70] font-bold text-sm px-6 py-3 transition-transform active:scale-95 whitespace-nowrap shrink-0"
              >
                إرسال تفاصيل المشروع ↗
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
