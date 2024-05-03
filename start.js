//import module
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// import libs
const func = require('./libs/function');
const util = require('./libs/utils');
const startBot = require('./libs/bot');

global.key;
global.bot = {};

bot.ip = 'local';
bot.key = '';
bot.cpu = '0 %';
bot.memory = '0 Mb';
bot.uptime = util.formatUptime(process.uptime());

bot.totalHits = 0;
bot.totalHitsPerDay = 0;
bot.totalViewAds = 0;
bot.totalViewAdsPerDay = 0;
bot.totalClickAds = 0;
bot.totalClickAdsPerDay = 0;
bot.totalHitsTime = 0;
bot.totalHitsTimePerDay = 0;
bot.totalError = 0;
bot.totalErrorPerDay = 0;

// main function
const runTasks = async () => {
  const promises = [];
  for (let i = 0; i < key.taskBot; i++) {
    promises.push(startBot(`BOT ${i + 1}`));
  }

  await Promise.all(promises);
  setTimeout(runTasks, 2000);
};

const runBot = async () => {
  console.clear();
  console.log('');
  console.log('');
  console.log('         -------  [ ADSENSE BOT ]  -------');
  console.log('   \x1b[33m[#]\x1b[0m IP Server   :', bot.ip);
  console.log('   \x1b[33m[#]\x1b[0m Negara      :', bot.country);
  console.log('   \x1b[33m[#]\x1b[0m Platform    :', bot.platform);
  console.log('   \x1b[33m[#]\x1b[0m Proxy       :', key?.withProxy ? 'Yes' : 'No (Recomended)');
  console.log('   \x1b[33m[#]\x1b[0m Kadaluwarsa :', key.expiredAt);
  console.log('   ---------------------------------------------');
  console.log('');
  console.log('');
  // runTasks();
};

const banner = () => {
  console.clear();
  console.log('');
  console.log('');
  console.log('        ------  [ JAGO BOT ]  ------');
  console.log('   \x1b[33m[#]\x1b[0m Author  : Fahmi Hdytllah');
  console.log('   \x1b[33m[#]\x1b[0m Website : https://bot.jagocode.my.id');
  console.log('   ------------------------------------------');
  console.log('');
  console.log('');
};

const checkToken = async token => {
  const findToken = await axios.get('https://bot.jagocode.my.id/api/checkToken?token=' + token);
  if (findToken.data.status) {
    console.log('\x1b[32m[✓]\x1b[0m', findToken.data.msg, 'kadaluwarsa pada', findToken.data.data.expiredAt);
    bot.key = token;
    await func.postDataBot();
    await func.setDataBot(findToken.data.data);
    runBot();
  } else {
    console.log('\x1b[31m[!]\x1b[0m', findToken.data.msg);
    process.exit(1);
  }
};

const loginToken = async () => {
  banner();
  const token = await func.ask('\x1b[36m[?]\x1b[0m Masukkan token : ');
  if (token) {
    return checkToken(token);
  } else {
    console.log('\x1b[31m[!]\x1b[0m Mohon masukkan token terlebih dauhulu!');
    process.exit(1);
  }
};

const start = async () => {
  banner();
  const getLocalToken = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
  if (getLocalToken?.token) {
    const findToken = await axios.get('https://bot.jagocode.my.id/api/checkToken?token=' + getLocalToken.token);
    if (findToken.data.status) return checkToken(getLocalToken.token);
    else return loginToken();
  } else return loginToken();
};

start();
