# Author    : https://www.instagram.com/fahmihdytllah
# Portfolio : https://fahmihdytllah.me
# Website   : https://bot.jagocode.my.id
# Updated   : 6 May 2024 11:14

# Note : Make sure you have changed the token in the config.json file, so that no errors occur when running the script with pm2

if command -v node &> /dev/null; then
    node_version=$(node -v)
    if [[ $node_version =~ ^v18\..* ]]; then
        echo "[✓] Node.js version: $node_version"
    else
        echo "[!] Node.js version is not 18.x."
    fi
else
    echo "[✓] Node.Js not found. Installing..."
    curl -s https://deb.nodesource.com/setup_18.x | sudo bash && sudo apt install nodejs -y
fi

echo "[✓] Installing components..."
npm install
if ! dpkg -s libgtk1.0-0 >/dev/null 2>&1; then
    sudo apt-get install libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 -y
fi

if ! command -v pm2 &> /dev/null
then
    echo "[✓] PM2 not found. Installing..."
    npm install -g pm2
fi

echo "[✓] Starting bot..."
pm2 start bot.js

xdg-open https://youtube.com/@JagoCode