const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const util = require('./utils');
const func = require('./function');

let listDomain = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/dataUrl.json'), 'utf8'));
let listProxy = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/dataProxy.json'), 'utf8'));

module.exports = async name => {
  let browser;
  let timerInterval;
  let timerCount = 0;

  try {
    let args;
    if (key?.withProxy) {
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
    const deviceNames = Object.keys(puppeteer.devices);
    const randomDeviceName = deviceNames[Math.floor(Math.random() * deviceNames.length)];
    const randomDevice = puppeteer.devices[randomDeviceName];
    const randomUrl = util.getRandom(listDomain);

    await page.emulate(randomDevice);
    await page.setJavaScriptEnabled(true);
    await page.setExtraHTTPHeaders({ Referer: util.getRandom(util.listReferer) });
    await page.goto(randomUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // await waitForCTA(page, name);
    // await waitForAdSense(page);
    await page.waitForSelector('.adsbygoogle', {
      visible: true,
      timeout: 10000
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
    if (bot.totalClickAdsPerDay > 0 && bot.totalClickAdsPerDay % 80 === 0) {
      if (bot.totalClickAdsPerDay !== key.clickAds) {
        await func.clickAds(page, '.adsbygoogle');
        await page.waitForTimeout(5000);
      }
    }

    clearInterval(timerInterval);
    const adsCount = await func.getVisibleAdsCount(page);
    bot.totalHitsTimePerDay = bot.totalHitsTimePerDay + timerCount;
    bot.totalViewAdsPerDay = bot.totalViewAdsPerDay + adsCount;
    bot.totalHits++;
    bot.totalHitsPerDay++;

    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Hit to\x1b[33m', bot.totalHitsPerDay, '\x1b[0mfrom\x1b[33m', randomDevice.name, '\x1b[0mwas successful');
    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Ads visible is\x1b[33m', adsCount, '\x1b[0mduring\x1b[33m', timerCount, '\x1b[0mseconds');
    console.log('\x1b[32m[+]\x1b[0m [\x1b[33m', name, '\x1b[0m] Complete hit from', randomUrl);
    console.log('----------------------------------------');
  } catch (e) {
    console.log('\x1b[31m[!]\x1b[0m [', name, ']', e.message);
    console.log('----------------------------------------');
    bot.totalError++;
    bot.totalErrorPerDay++;
  } finally {
    browser && browser.close();
  }
};
