# دليل رفع المشروع على GitHub

## 📋 الخطوات المطلوبة

### 1. إنشاء مستودع GitHub

1. **اذهب إلى GitHub**
   - افتح [github.com](https://github.com)
   - سجل دخول أو أنشئ حساب جديد

2. **أنشئ مستودع جديد**
   - اضغط على زر "New repository"
   - اسم المستودع: `hajmasport`
   - الوصف: `قالب ووردبريس لعرض المباريات الرياضية المباشرة مع تصميم مستوحى من نتفليكس`
   - اجعله عام (Public)
   - لا تضيف README أو .gitignore أو LICENSE (لدينا بالفعل)

### 2. رفع الملفات

#### الطريقة الأولى: عبر سطر الأوامر

```bash
# تهيئة Git في المجلد
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "🎉 الإصدار الأول من قالب HAJMASPORT"

# ربط المستودع المحلي بـ GitHub
git remote add origin https://github.com/YOUR_USERNAME/hajmasport.git

# رفع الملفات
git branch -M main
git push -u origin main
```

#### الطريقة الثانية: عبر GitHub Desktop

1. حمل [GitHub Desktop](https://desktop.github.com/)
2. اضغط "Add an Existing Repository from your Hard Drive"
3. اختر مجلد المشروع
4. اضغط "Publish repository"

#### الطريقة الثالثة: رفع مباشر

1. اضغط "uploading an existing file" في GitHub
2. اسحب جميع الملفات إلى المتصفح
3. اكتب رسالة commit
4. اضغط "Commit new files"

### 3. إعداد GitHub Pages (اختياري)

لإنشاء موقع عرض مباشر:

1. **اذهب إلى إعدادات المستودع**
   - Settings > Pages

2. **اختر المصدر**
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **احفظ الإعدادات**
   - سيكون الموقع متاح على: `https://YOUR_USERNAME.github.io/hajmasport`

### 4. إضافة الوسوم والإصدارات

```bash
# إضافة وسم للإصدار الأول
git tag -a v1.0.0 -m "الإصدار الأول من HAJMASPORT"
git push origin v1.0.0
```

### 5. إنشاء Release

1. اذهب إلى تبويب "Releases"
2. اضغط "Create a new release"
3. اختر الوسم v1.0.0
4. العنوان: "HAJMASPORT v1.0.0 - الإصدار الأول"
5. الوصف: انسخ من CHANGELOG.md
6. أرفق ملف ZIP للقالب
7. اضغط "Publish release"

## 🌟 تحسين المستودع

### إضافة Topics

في الصفحة الرئيسية للمستودع:
- اضغط على رمز الترس بجانب "About"
- أضف Topics: `wordpress`, `theme`, `sports`, `football`, `netflix-style`, `rtl`, `arabic`

### إضافة وصف

```
قالب ووردبريس احترافي لعرض المباريات الرياضية المباشرة مع تصميم مستوحى من نتفليكس. يدعم العربية والـ RTL مع مشغل بث مدمج.
```

### إضافة رابط الموقع

إذا كان لديك عرض مباشر، أضف الرابط في قسم "Website"

## 📊 إحصائيات وشارات

أضف هذه الشارات إلى README.md:

```markdown
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/hajmasport.svg)](https://github.com/YOUR_USERNAME/hajmasport/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/hajmasport.svg)](https://github.com/YOUR_USERNAME/hajmasport/network)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/hajmasport.svg)](https://github.com/YOUR_USERNAME/hajmasport/issues)
[![GitHub license](https://img.shields.io/github/license/YOUR_USERNAME/hajmasport.svg)](https://github.com/YOUR_USERNAME/hajmasport/blob/main/LICENSE)
```

## 🔄 التحديثات المستقبلية

```bash
# إضافة تغييرات جديدة
git add .
git commit -m "✨ إضافة ميزة جديدة"
git push origin main

# إنشاء إصدار جديد
git tag -a v1.1.0 -m "إصدار 1.1.0 - إضافة ميزات جديدة"
git push origin v1.1.0
```

## 📝 ملاحظات مهمة

- استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك
- تأكد من أن جميع الملفات موجودة قبل الرفع
- اقرأ ملف CONTRIBUTING.md لفهم كيفية المساهمة
- استخدم رسائل commit واضحة ووصفية

## 🎯 الخطوات التالية

بعد رفع المشروع:

1. ✅ شارك الرابط مع الأصدقاء
2. ✅ أضف المشروع إلى ملفك الشخصي
3. ✅ انشر عنه في وسائل التواصل
4. ✅ اطلب من الآخرين تجربته وإعطاء نجوم
5. ✅ استمر في التطوير والتحديث

---

**مبروك! 🎉 مشروعك الآن متاح للعالم على GitHub!**