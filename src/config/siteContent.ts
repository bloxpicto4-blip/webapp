/**
 * ملف إعدادات المحتوى والنصوص المركزي (Site Content & Config)
 * يمكنك تعديل جميع النصوص، البريد الإلكتروني، المشاريع، والمراحل من هذا الملف بسهولة.
 */

export interface ProjectItem {
  id: string;
  number: string;
  titleEn: string;
  categoryEn: string;
  subtitleAr: string;
  descriptionAr: string;
  year: string;
  deliverables: string[];
  metricsAr: string;
  accentColor: string;
  secondaryColor: string;
  visualType: 'nexus' | 'timebox' | 'arcade';
  caseStudyDetails: {
    challenge: string;
    architecture: string;
    outcome: string;
  };
}

export interface ProcessStage {
  number: string;
  titleEn: string;
  titleAr: string;
  descriptionAr: string;
  deliverableAr: string;
}

export const SITE_CONFIG = {
  // البريد الإلكتروني الأساسي واسم المصمم/المطور (قابل للتعديل بسهولة من هنا)
  email: 'hello@example.com',
  brandMark: 'LEVEL / 01',
  year: '2026',
  creator: {
    prefixEn: 'MADE BY',
    nameEn: 'ABDELRHMAN MOHAMED',
    nameAr: 'عبدالرحمن محمد',
    roleEn: 'CREATIVE DEVELOPER & 3D MOTION DESIGNER',
    roleAr: 'تطوير إبداعي · تصميم تفاعلي ثلاثي الأبعاد',
  },

  // روابط القائمة العلوية (Navbar)
  navLinks: [
    { id: 'work', label: 'الأعمال', href: '#work' },
    { id: 'system', label: 'النظام', href: '#system' },
    { id: 'about', label: 'عنّي', href: '#about' },
    { id: 'contact', label: 'تواصل', href: '#contact' },
  ],
  ctaLabel: 'ابدأ مشروعًا ↗',

  // القسم الرئيسي (Hero Section)
  hero: {
    tagEn: 'PORTFOLIO · 2026 EDITION',
    headlineLine1: 'أحوّل',
    headlineAccent: 'الفكرة',
    headlineLine3: 'إلى',
    headlineGradient: 'تجربة.',
    subtitle: 'تصميم رقمي · تطوير · تجارب تفاعلية',
    description:
      'أصنع تجارب رقمية مختلفة، سريعة، واضحة، ومبنية حول حركة المستخدم.',
    ctaButtonText: 'شاهد الأعمال',
    metaItems: ['DESIGN', 'MOTION', 'DEVELOPMENT'],
  },

  // قسم المقدمة الفلسفية (Intro Statement)
  introStatement: {
    sectionIndex: '01 / PHILOSOPHY',
    headlinePart1: 'الموقع مش مجرد',
    headlineMutedWord: 'صفحة.',
    bodyLine1: 'هو مساحة لها إيقاع.',
    bodyLine2: 'كل Scroll وكل حركة وكل تفصيلة لها سبب.',
    supportingNote:
      'التجربة الرقمية الناجحة لا تُقاس بعدد الصفحات، بل بمدى انسيابية اللحظة التي ينتقل فيها المستخدم من الفضول إلى الاقتناع.',
  },

  // قسم المشاريع المختارة (02 / SELECTED WORK)
  selectedWork: {
    sectionIndex: '02 / SELECTED WORK',
    titleLine1: 'مشاريع',
    titleLine2: 'مختارة.',
    subtitle: 'ثلاثة منتجات رقمية صُممت كلغة بصرية وحركية متكاملة',
    projects: [
      {
        id: 'nexus',
        number: '01',
        titleEn: 'NEXUS',
        categoryEn: 'Digital System',
        subtitleAr: 'نظام تصميم وبنية تفاعلية للمنصات التقنية المتقدمة',
        descriptionAr:
          'منظومة رقمية متكاملة تجمع بين سرعة الأداء الفائقة والهوية الحركية الدقيقة، مصممة لإدارة البيانات الحية بتجربة بصرية سينمائية.',
        year: '2026',
        deliverables: ['DESIGN SYSTEM', 'MOTION ENGINE', 'FRONTEND ARCHITECTURE'],
        metricsAr: '+64% تسارع في استجابة الواجهة وتفاعل المستخدمين',
        accentColor: '#D9FF43',
        secondaryColor: '#0C1A12',
        visualType: 'nexus',
        caseStudyDetails: {
          challenge:
            'تحويل واجهة بيانات معقدة إلى مساحة بصرية هادئة تستجيب لحركة المؤشر والتمرير دون أي ثقل بصري.',
          architecture:
            'بناء محرك حركة مخصص يعتمد على WebGL وCSS Compositor layers مع نظام تصميم معياري متكامل.',
          outcome:
            'تقليل زمن الوصول للمعلومات الأساسية بنسبة 42% مع تحقيق هوية بصرية فريدة في قطاع التقنية.',
        },
      },
      {
        id: 'timebox',
        number: '02',
        titleEn: 'TIMEBOX',
        categoryEn: 'Memory / Social Experience',
        subtitleAr: 'تجربة اجتماعية تفاعلية لحفظ واسترجاع اللحظات عبر الزمن',
        descriptionAr:
          'فضاء رقمي يعيد تعريف الأرشيف الشخصي والاجتماعي كرحلة زمنية ثلاثية الأبعاد، حيث تتحول الذكريات إلى كبسولات تفاعلية حية.',
        year: '2026',
        deliverables: ['SPATIAL UI', 'INTERACTIVE TIMELINE', 'CREATIVE DEV'],
        metricsAr: '3.8x زيادة في متوسط مدة الجلسة التفاعلية',
        accentColor: '#9D7BFF',
        secondaryColor: '#191332',
        visualType: 'timebox',
        caseStudyDetails: {
          challenge:
            'ابتكار طريقة تصفح غير خطية للذكريات تتجاوز القوائم التقليدية وتمنح شعورًا بالعمق الزمني.',
          architecture:
            'تصميم خط زمني يعتمد على الفيزياء التفاعلية والانتقالات السلسة المدعومة بـ GSAP ScrollTrigger.',
          outcome:
            'تجربة غامرة حصدت تفاعلًا استثنائيًا بفضل الدمج بين البساطة البصرية والعمق الحركي.',
        },
      },
      {
        id: 'arcade',
        number: '03',
        titleEn: 'ARCADE',
        categoryEn: 'Gaming Platform',
        subtitleAr: 'منصة ألعاب وتجارب تنافسية بهوية مستقبلية فائقة السرعة',
        descriptionAr:
          'واجهة جيل جديد لمنصات الألعاب السحابية، مبنية على شبكة هندسية مظلمة ونقاط طاقة نيون تتفاعل لحظيًا مع إيقاع اللاعب.',
        year: '2026',
        deliverables: ['PLATFORM UI', 'REALTIME MOTION', 'SOUND & VISUAL SYNC'],
        metricsAr: '120fps ثبات كامل في الأداء الحركي عبر المتصفح',
        accentColor: '#D9FF43',
        secondaryColor: '#0A101D',
        visualType: 'arcade',
        caseStudyDetails: {
          challenge:
            'تقديم إحساس منصات الألعاب الاحترافية داخل متصفح الويب مع الحفاظ على سرعة تحميل فورية.',
          architecture:
            'شبكة هندسية تفاعلية مرسومة عبر Canvas 2D/3D مع استجابة فورية لأوامر لوحة المفاتيح والمؤشر.',
          outcome:
            'تحقيق تجربة تصفح خالية من أي تأخير مع هوية بصرية حادة تترك انطباعًا فوريًا.',
        },
      },
    ] as ProjectItem[],
  },

  // قسم النظام والعداد (03 / THE SYSTEM)
  systemSection: {
    sectionIndex: '03 / THE SYSTEM',
    counterStart: 0,
    counterTarget: 10,
    headlineLine1: 'كل مشروع',
    headlineLine2: 'له نظام.',
    flowText: 'بحث → فكرة → تصميم → حركة → تطوير → إطلاق.',
    flowStepsAr: ['بحث', 'فكرة', 'تصميم', 'حركة', 'تطوير', 'إطلاق'],
    processStages: [
      {
        number: '01',
        titleEn: 'DISCOVER',
        titleAr: 'فهم المشكلة',
        descriptionAr:
          'قراءة عميقة لجوهر المنتج، سلوك المستخدم، والفرصة البصرية التي تميز المشروع عن السائد.',
        deliverableAr: 'خارطة التجربة · تحليل الإيقاع البصري',
      },
      {
        number: '02',
        titleEn: 'DEFINE',
        titleAr: 'تحديد الاتجاه',
        descriptionAr:
          'صياغة الفكرة المحورية وبناء هيكل السرد التفاعلي (Scroll Storytelling) الذي يقود رحلة الزائر.',
        deliverableAr: 'المعمارية التفاعلية · سيناريو الحركة',
      },
      {
        number: '03',
        titleEn: 'DESIGN',
        titleAr: 'بناء اللغة البصرية',
        descriptionAr:
          'تطوير نظام تايبوجرافي جريء، تباين لوني مدروس، ومساحات سلبية تمنح كل عنصر ثقله البصري.',
        deliverableAr: 'الهوية الرقمية · النماذج التفاعلية الحية',
      },
      {
        number: '04',
        titleEn: 'BUILD',
        titleAr: 'تحويلها إلى منتج',
        descriptionAr:
          'كتابة كود نظيف فائق السرعة مع حركات دقيقة (Micro-interactions) تعمل بسلاسة على كل الشاشات.',
        deliverableAr: 'تطوير الواجهة · تحسين الأداء 60/120fps',
      },
    ] as ProcessStage[],
  },

  // قسم عنّي (04 / ABOUT)
  aboutSection: {
    sectionIndex: '04 / ABOUT',
    headlineLine1: 'أصنع أشياء',
    headlineLine2: 'تستحق التذكر.',
    description:
      'أركز على الواجهات التي تشعر أنها منتج حقيقي: حركة محسوبة، تايبوجرافي قوي، مساحات، وتفاصيل تظهر مع الاستخدام.',
    secondaryParagraph:
      'أجمع بين التفكير التصميمي الصارم والهندسة البرمجية الإبداعية لتحويل المفاهيم المجردة إلى واجهات تنبض بالحياة وتبقى في الذاكرة.',
    stats: [
      {
        value: '06',
        label: 'مراحل العمل',
        detailEn: 'SYSTEMATIC FLOW',
      },
      {
        value: '03',
        label: 'أنواع مشاريع',
        detailEn: 'DESIGN · MOTION · DEV',
      },
      {
        value: '∞',
        label: 'أفكار جديدة',
        detailEn: 'ENDLESS EXPLORATION',
      },
    ],
  },

  // قسم التايبوجرافي العملاق (BIG TYPOGRAPHY SECTION)
  bigTypography: {
    word1: 'MAKE',
    word2: 'IT',
    word3: 'MOVE.',
    captionAr: 'الحركة ليست زينة — الحركة هي اللغة التي تشرح كيف يعمل المنتج.',
  },

  // قسم التواصل (CONTACT)
  contactSection: {
    sectionIndex: '05 / CONTACT',
    headlineLine1: 'عندك فكرة؟',
    headlineLine2: 'خلينا',
    headlineLine3: 'نبنيها.',
    subtextAr: 'متاح للمشاريع المختارة، الاستشارات الإبداعية، وتطوير التجارب الرقمية في 2026.',
  },

  // الفوتر (FOOTER)
  footer: {
    brand: 'LEVEL / 01',
    copyright: '© 2026 — ALL RIGHTS RESERVED',
    backToTop: 'BACK TO TOP ↑',
  },
};
