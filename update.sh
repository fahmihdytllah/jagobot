# Author    : https://www.instagram.com/fahmihdytllah
# Portfolio : https://fahmihdytllah.me
# Website   : https://bot.jagocode.id
# Updated   : 17 Sep 2024 20:27

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

if command_exists git; then
  echo "[✓] Updating to the latest version..."
  git stash
  git pull origin main
  
  echo "[✓] Updating dependencies..."
  npm install
else
  echo "[!] Git not installed..."
fi

xdg-open https://youtube.com/@JagoCode

echo "[✓] All components have been successfully updated..."
echo "[✓] Run normally > node bot.js"
echo "[✓] Run in the background > pm2 start jagobot.json"
