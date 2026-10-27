#!/bin/bash
echo "🚀 شروع فرآیند دیپلوی..."
pnpm build || exit 1
./deploy.sh || exit 1
git add . && git commit -m "auto-deploy: update" && git push origin main
echo "✅ همه چیز با موفقیت آپدیت شد!"
