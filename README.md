# LEVEL / 01 — Creative Developer & Digital Designer Portfolio (2026)

موقع بورتفوليو شخصي وتجربة رقمية تفاعلية باللغة العربية (`RTL`)، مصمم بهوية سينمائية حديثة مستوحاة من أسلوب وكالات التصميم الإبداعية العالمية لعام 2026.

---

## المميزات الأساسية

- **تصميم عربي أصيل (RTL First):** تايبوجرافي ضخم ومتوازن باستخدام خطوط `Cairo` و `IBM Plex Sans Arabic` مع توظيف مقصود للمصطلحات التقنية الإنجليزية (`Syne` و `IBM Plex Mono`).
- **مجسم كروي ثلاثي الأبعاد تفاعلي (Hero 3D Metallic Orb):** مرسوم برمجيًا بتوهج داخلي أخضر (`#D9FF43`) وانعكاسات معدنية تتفاعل مع حركة الماوس والتمرير، مع إيقاف تلقائي عند الخروج من الشاشة (`IntersectionObserver`) لأعلى أداء.
- **سرد بصري حركي (Scroll Storytelling):** مدعوم بمكتبة `GSAP` و `ScrollTrigger` لظهور الكلمات، تحريك البطاقات، العداد الرقمي (`00` → `10`)، وقسم التايبوجرافي العملاق (`MAKE IT MOVE.`).
- **لوحات فنية برمجية للمشاريع (Procedural Digital Art):** رسومات تجريدية حية خاصة بكل مشروع (`NEXUS`, `TIMEBOX`, `ARCADE`) مرسومة عبر Canvas بدون أي صور جاهزة أو تقليدية، مع نافذة دراسة حالة تفاعلية عند النقر.
- **مؤشر مخصص لسطح المكتب (Custom Desktop Cursor):** يتفاعل مع الروابط ويعرض `VIEW` / `OPEN` عند المرور فوق المشاريع، ويختفي تلقائيًا على أجهزة اللمس والموبايل.
- **توافق كامل مع معايير الوصول والأداء:** دعم `prefers-reduced-motion`، تنقل كامل بلوحة المفاتيح (`Tab` / `Escape`)، وتصميم متجاوب من شاشات `320px` حتى `1920px`.

---

## هيكل الملفات

```text
├── index.html                           # ملف HTML الرئيسي (RTL + خطوط Google Fonts)
├── src/
│   ├── index.css                        # متغيرات الألوان المركزية (:root) والتنسيقات العامة
│   ├── config/
│   │   └── siteContent.ts               # جميع نصوص الموقع، البريد الإلكتروني، وبيانات المشاريع
│   ├── components/
│   │   ├── CustomCursor.tsx             # المؤشر التفاعلي المخصص لسطح المكتب
│   │   ├── Navbar.tsx                   # شريط التنقل الثابت + قائمة الموبايل السينمائية
│   │   ├── HeroOrb3D.tsx                # المجسم الثلاثي الأبعاد التفاعلي في قسم الـ Hero
│   │   ├── ProjectArtVisual.tsx         # اللوحات التجريدية الحية للمشاريع الثلاثة
│   │   └── ProjectCaseStudyModal.tsx    # نافذة دراسة الحالة + نافذة بدء مشروع جديد
│   ├── App.tsx                          # المكون الرئيسي وتجربة السرد البصري (GSAP ScrollTrigger)
│   └── main.tsx                         # نقطة تشغيل التطبيق
└── README.md                            # دليل التشغيل والتعديل والنشر
```

---

## طريقة التشغيل محليًا

1. **تثبيت الحزم:**
   ```bash
   npm install
   ```

2. **تشغيل خادم التطوير المحلي:**
   ```bash
   npm run dev
   ```
   سيعمل الموقع على الرابط `http://localhost:3000`.

3. **بناء نسخة الإنتاج (Production Build):**
   ```bash
   npm run build
   ```
   سيتم إنشاء مجلد `dist/` الجاهز للنشر على أي خدمة استضافة ثابتة.

---

## تعديل النصوص، البريد الإلكتروني، والألوان بسهولة

### 1. تغيير البريد الإلكتروني وجميع النصوص (`src/config/siteContent.ts`)
افتح الملف `src/config/siteContent.ts` وعدّل القيم مباشرة:
```ts
export const SITE_CONFIG = {
  email: 'hello@example.com', // غيّر بريدك الإلكتروني هنا
  brandMark: 'LEVEL / 01',
  // يمكنك تعديل نصوص Hero والمشاريع والمراحل من نفس الملف
};
```

### 2. تغيير الألوان من مكان واحد (`src/index.css`)
افتح الملف `src/index.css` وعدّل متغيرات `:root` في أعلى الملف:
```css
:root {
  --bg-primary: #08090D;
  --bg-secondary: #0B0D12;
  --bg-elevated: #10121A;
  --text-primary: #F2F4F8;
  --accent-lime: #D9FF43;
}
```

---

## تعليمات النشر على GitHub Pages / Netlify / Vercel

### النشر على GitHub Pages
1. ارفع الكود إلى مستودع GitHub خاص بك.
2. في ملف `vite.config.ts`، إذا كان اسم المستودع مثلًا `my-portfolio`، أضف خاصية `base: '/my-portfolio/'` (أو اتركها `'./'` للنشر على نطاق مخصص).
3. قم ببناء المشروع:
   ```bash
   npm run build
   ```
4. انشر محتويات مجلد `dist` باستخدام `gh-pages` أو عبر **GitHub Actions**:
   - من إعدادات المستودع في GitHub اذهب إلى **Settings → Pages**.
   - اختر **Source: GitHub Actions** واستخدم قالب **Static HTML / Vite** ليتم بناء ونشر مجلد `dist` تلقائيًا مع كل `git push`.

### النشر على Vercel أو Netlify
- اربط المستودع بحسابك في **Vercel** أو **Netlify**.
- إعدادات البناء التلقائية:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
