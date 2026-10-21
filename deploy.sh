#!/data/data/com.termux/files/usr/bin/bash
set -e
echo "🔨 Build..."
pnpm build

EXPECTED=$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' docs/index.html | head -1)
echo "📦 New bundle: $EXPECTED"

echo "🚀 Deploy..."
rsync -avz --delete \
  --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  --chown=www-data:www-data \
  -e "ssh -i $HOME/.ssh/arvan.pem" \
  docs/ \
  root@85.198.55.141:/var/www/cafetorshi/docs/

echo "🔍 Verify..."
sleep 2
ACTUAL=$(curl -s https://cafetorshi.ir/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1)
CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://cafetorshi.ir/$ACTUAL")

if [ "$ACTUAL" = "$EXPECTED" ] && [ "$CODE" = "200" ]; then
  echo "✅ Deployed: $ACTUAL ($CODE)"
else
  echo "❌ MISMATCH!"
  echo "   expected: $EXPECTED"
  echo "   actual:   $ACTUAL"
  echo "   HTTP:     $CODE"
  exit 1
fi
