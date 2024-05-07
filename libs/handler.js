// import module
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const randomUserAgent = require('random-useragent');
const { parse: parseUserAgent } = require('useragent');

// import lib
const util = require('./utils');
const func = require('./function');
const listSwitch = [
  'randomDesktop',
  'randomMobile'
];

module.exports = async name => {
  if (!global?.key || !key?.key || !global?.bot || !bot?.key) {
    console.log('\x1b[31m[!]\x1b[0m Global variable tidak terdeteksi!');
    process.exit(1);
  }
  
  let browser;
  let timerInterval;
  let timerCount = 0;
  let listDomain = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/dataUrl.json'), 'utf8'));
  let listProxy = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/dataProxy.json'), 'utf8'));
  let listReferer = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/dataReferer.json'), 'utf8'));

  try {
    let args;
    if (global?.key?.withProxy) {
      args = ['--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=http://${util.getRandom(listProxy)}`];
    } else {
      args = ['--no-sandbox', '--disable-setuid-sandbox'];
    }

    browser = await puppeteer.launch({
      headless: 'new',
      args
    });

    const startTimer = () => {
      timerCount = 0;
      timerInterval = setInterval(() => {
        timerCount++;
      }, 1000);
    };
    
    const page = await browser.newPage();
    const randomUrl = util.getRandom(listDomain);
    const Referer = key?.customReferer ? util.getRandom(listReferer) : util.getRandom(util.listReferer);
    let deviceName;
    
    const randomDesktop = async () => {
      const randomAgent = randomUserAgent.getRandom();
      deviceName = parseUserAgent(randomAgent).os.toString();
      await page.setUserAgent(randomAgent);
      await page.setViewport({
        width: 1366,
        height: 768,
        isMobile: false,
        deviceScaleFactor: 1,
      });
    }
    
    const randomMobile = async () => {
      const listDeviceNames = Object.keys(puppeteer.devices);
      const randomDeviceName = listDeviceNames[Math.floor(Math.random() * listDeviceNames.length)];
      const randomDevice = puppeteer.devices[randomDeviceName];
      deviceName = randomDevice.name;
      await page.emulate(randomDevice);
    }
    
    if (key?.randomUserAgent && key?.autoSwitch) {
      if (util.getRandom(listSwitch) === 'randomDesktop') {
        await randomDesktop();
      } else {
        await randomMobile();
      }
    } else if (key?.randomUserAgent) {
      await randomDesktop();
    } else {
      await randomMobile();
    }
    
    await page.setJavaScriptEnabled(true);
    await page.setExtraHTTPHeaders({ Referer });
    await page.goto(randomUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('.adsbygoogle', {
      visible: true,
      timeout: 15000
    });

    startTimer();
    // display ads 1x
    await func.scrollDown(page);
    await page.waitForTimeout(2000);
    await func.scrollUpSlowly(page);
    await page.waitForTimeout(2000);

    // display ads 2x
    await func.scrollDown(page);
    await page.waitForTimeout(2000);
    await func.scrollUpSlowly(page);
    await page.waitForTimeout(2000);

    // auto click ads adsense
    if (global.bot.totalClickAdsPerDay > 0 && global.bot.totalClickAdsPerDay % 80 === 0) {
      if (global.bot.totalClickAdsPerDay !== global.key.clickAds) {
        await func.clickAds(page, '.adsbygoogle');
        await page.waitForTimeout(5000);
      }
    }

    clearInterval(timerInterval);
    const adsCount = await func.getVisibleAdsCount(page);
    global.bot.totalHitsTimePerDay = global.bot.totalHitsTimePerDay + timerCount;
    global.bot.totalViewAdsPerDay = global.bot.totalViewAdsPerDay + adsCount;
    global.bot.totalHits++;
    global.bot.totalHitsPerDay++;

    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Hit to\x1b[33m', global.bot.totalHitsPerDay, '\x1b[0mfrom\x1b[33m', deviceName, '\x1b[0mwas successful');
    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Ads visible is\x1b[33m', adsCount, '\x1b[0mduring\x1b[33m', timerCount, '\x1b[0mseconds');
    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Complete hit from', randomUrl);
    console.log('----------------------------------------');
  } catch (e) {
    console.log('\x1b[31m[!]\x1b[0m [', name, ']', e.message);
    console.log('----------------------------------------');
    global.bot.totalError++;
    global.bot.totalErrorPerDay++;
  } finally {
    browser && browser.close();
  }
};
