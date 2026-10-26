#!/data/data/com.termux/files/usr/bin/bash
clear
echo "=========================================="
echo "📦 برای چت جدید، این متن رو کپی کن:"
echo "=========================================="
echo ""
cat << 'INTRO'
سلام. من مجتبی، صاحب کافه ترشی (cafetorshi.ir).

وظیفه:
1. اسناد رو کامل بخون
2. خلاصه ۵ خطی بده
3. مشکل فعلی رو از REMAINING + HANDOFF استخراج کن
4. منتظر «شروع کن» بمون

قوانین:
- فارسی
- کد کوتاه و کامل
- هر دستور، بگو کجا اجرا شه
- هر تغییر → آپدیت اسناد → git push
- کلیدهای حساس تو اسناد نباشن

محدودیت:
- Termux فقط، بدون کامپیوتر
- JavaScript نه TypeScript

منتظر ۵ فایل هستم.

==========================================
=== START.md ===
INTRO
cat START.md
echo ""
echo "=== MASTER-V3.md ==="
cat MASTER-V3.md
echo ""
echo "=== HANDOFF.md ==="
cat HANDOFF.md
echo ""
echo "=== AI-CONTRACT.md ==="
cat AI-CONTRACT.md
echo ""
echo "=== CHANGELOG.md ==="
cat CHANGELOG.md
echo ""
echo "=== REMAINING.md ==="
cat REMAINING.md
echo ""
echo "=========================================="
