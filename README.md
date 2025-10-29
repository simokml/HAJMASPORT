# HAJMASPORT ⚽

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-GPL%20v2-green.svg)](LICENSE)
[![RTL](https://img.shields.io/badge/RTL-Supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)

> موقع ويب احترافي لعرض المباريات الرياضية المباشرة مع تصميم مستوحى من نتفليكس

![HAJMASPORT Preview](https://via.placeholder.com/800x400/141414/e50914?text=HAJMASPORT+Preview)

## 🌟 المميزات الرئيسية

- 🎨 **تصميم مستوحى من نتفليكس** - واجهة أنيقة ومظلمة
- 🌍 **دعم كامل للعربية** - RTL وترجمة شاملة
- ⚡ **مباريات مباشرة** - عرض المباريات من API حقيقي
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🔴 **بث مباشر** - مشغل فيديو مدمج
- ⚙️ **إعدادات مرنة** - تخصيص الألوان والإعدادات
- 🔄 **تحديث تلقائي** - بيانات محدثة كل دقيقة
- 🏆 **ترجمة ذكية** - أسماء الفرق والدوريات بالعربية

## 🚀 العرض المباشر

[مشاهدة العرض المباشر](https://hajmasport-demo.github.io) | [لقطات الشاشة](#-لقطات-الشاشة)

## 📋 المتطلبات

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- خادم ويب (Apache, Nginx) أو GitHub Pages
- مفتاح API من [Sportmonks](https://www.sportmonks.com/) (اختياري للبيانات الحقيقية)

## 🔧 دعم API

القالب يدعم **Sportmonks API** لجلب بيانات المباريات الحقيقية:

- ⚽ عرض المباريات المباشرة والقادمة
- 📊 النتائج والإحصائيات التفصيلية  
- 🏟️ معلومات الفرق والدوريات
- 📝 أحداث المباراة (أهداف، بطاقات، تبديلات)
- 🔄 تحديث تلقائي كل 30 ثانية

## 📦 التثبيت والاستخدام

### الطريقة الأولى: GitHub Pages (مجاني)

1. **Fork المشروع**
   ```bash
   # أو استنسخ المشروع
   git clone https://github.com/username/hajmasport.git
   cd hajmasport
   ```

2. **رفع إلى GitHub**
   - أنشئ مستودع جديد على GitHub
   - ارفع الملفات إلى المستودع
   - فعل GitHub Pages من Settings > Pages

3. **الوصول للموقع**
   - سيكون متاح على: `https://username.github.io/hajmasport`

### الطريقة الثانية: خادم ويب محلي

1. **حمل الملفات**
   ```bash
   git clone https://github.com/username/hajmasport.git
   ```

2. **ارفع إلى الخادم**
   - ارفع جميع الملفات إلى مجلد الموقع
   - افتح `index.html` في المتصفح

## ⚙️ الإعداد والتخصيص

### 1. إعداد API (اختياري)

للحصول على مباريات حقيقية:

1. **سجل في Sportmonks**
   - اذهب إلى [sportmonks.com](https://www.sportmonks.com/)
   - أنشئ حساب واحصل على API key

2. **أضف المفتاح**
   - افتح ملف `live-match.js`
   - استبدل `YOUR_API_KEY_HERE` بمفتاحك
   - احفظ الملف

### 2. تخصيص المحتوى

- **الألوان**: عدل ملف `live-match.css`
- **البيانات**: عدل البيانات الاحتياطية في `live-match.js`
- **الروابط**: عدل روابط وسائل التواصل في `live-match.html`

== Frequently Asked Questions ==

= هل القالب مجاني؟ =

نعم، القالب مجاني تماماً ومفتوح المصدر.

= هل يدعم القالب اللغة العربية؟ =

نعم، القالب مصمم خصيصاً للغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار.

= هل أحتاج إلى مفتاح API؟ =

لعرض المباريات الحقيقية، نعم تحتاج إلى مفتاح API من Sportmonks. لكن القالب يعمل مع بيانات تجريبية بدون API.

= هل يعمل القالب على الهواتف؟ =

نعم، القالب متجاوب تماماً ويعمل بشكل مثالي على جميع الأجهزة.

== Screenshots ==

1. الصفحة الرئيسية مع عرض المباريات
2. صفحة المباراة المباشرة مع المشغل
3. إعدادات التخصيص
4. التصميم المتجاوب على الهواتف

== Changelog ==

= 1.0 =
* الإصدار الأول من القالب
* تصميم مستوحى من نتفليكس
* دعم API للمباريات المباشرة
* مشغل بث مدمج
* دعم كامل للعربية

== Upgrade Notice ==

= 1.0 =
الإصدار الأول من قالب HAJMASPORT.

== Credits ==

* تصميم مستوحى من Netflix
* خطوط من Google Fonts (Cairo)
* أيقونات من Unicode Emoji

== Support ==

للدعم الفني والمساعدة:
* GitHub: [رابط المشروع]
* البريد الإلكتروني: support@hajmasport.com

== License ==

هذا القالب مرخص تحت رخصة GPL v2 أو أحدث.
يمكنك استخدامه وتعديله بحرية.