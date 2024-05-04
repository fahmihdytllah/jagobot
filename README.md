<img src="https://i.ibb.co/cy3ShSp/1714800784906.jpg" alt="empas project" width="500" />

# **Jago Bot**

> The tool for Adsense Web mining is very easy to use and easy to manage, running with the nodejs programming language

# System Requirements
Make sure you have a competent computer/laptop/VPS/RDP/Virtual Machine because running this bot is a bit heavy, friend.

* CPU 2 CORE / 2GB MEMORY
* 20GB Storage (SSD if possible)
* Windows/Ubuntu/Linux/CentOS
* Make sure the network is stable
* Access Key

# Installation
Before proceeding to the installation, you must first register at [bot.jagocode.my.id](https://bot.jagocode.my.id/auth/register) to get the Access Key which will later run your bot, free and paid versions available.

## Connection configuration
Open the config.json file in the token properties section, change the value using the token you have purchased, if you don't know the token you can look at the [Access Key](https://bot.jagocode.my.id/u/keys) dashboard menu.

## Linux/Ubuntu
```cmd
$ curl -s https://deb.nodesource.com/setup_18.x | sudo bash && sudo apt install nodejs -y
$ sudo apt install ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils -y
$ git clone https://github.com/fahmihdytllah/jagobot
$ cd jagobot
$ node bot.js
```

## CentOs
```cmd
$ curl -sL https://rpm.nodesource.com/setup_8.x | sudo bash -
$ yum install alsa-lib.x86_64 atk.x86_64 cups-libs.x86_64 gtk3.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 libXtst.x86_64 pango.x86_64 xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-fonts-cyrillic xorg-x11-fonts-misc xorg-x11-fonts-Type1 xorg-x11-utils -y && yum update nss -y
$ git clone https://github.com/fahmihdytllah/jagobot
$ cd jagobot
$ node bot.js
```

## Windows
Download [NodeJs](https://nodejs.org/en/download) directly from the official site then install. Use node js version 18.xx and above, if you use 18.xx and below an error will occur.

```cmd
$ git clone https://github.com/fahmihdytllah/jagobot
$ cd jagobot
$ node bot.js
```

# Run in the background
If you want to run the bot in the background, you can follow the following command.

```cmd
$ npm install -g pm2
$ pm2 start bot.js
```

To check the activity log, use the pm2 logs command