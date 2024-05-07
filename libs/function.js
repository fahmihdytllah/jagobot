/***
 * Author    : https://www.instagram.com/fahmihdytllah
 * Portfolio : https://fahmihdytllah.me
 * Website   : https://bot.jagocode.my.id
 * Updated   : 6 May 2024 10:47
 ***/

const pidusage = require('pidusage');
const cron = require('node-cron');
const readline = require('readline');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('./utils');

let pathDataUrl = path.join(__dirname, '../json/dataUrl.json');
let pathDataProxy = path.join(__dirname, '../json/dataProxy.json');
let pathDataReferer = path.join(__dirname, '../json/dataReferer.json');
let pathConfig = path.join(__dirname, '../config.json');

// module function
function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

const postDataBot = async () => {
  try {
    const postDataBot = await axios.post('https://bot.jagocode.my.id/api/saveDataBot', global.bot);
    global.bot = postDataBot.data.data;
    console.log('\x1b[32m[✓]\x1b[0m Data bot berhasil di kirim...');
    return true;
  } catch (e) {
    console.log(e);
    console.log('\x1b[31m[!]\x1b[0m Gagal mengirim data bot!');
  }
};

const updateDataBot = async () => {
  if (global.bot.ip !== 'local') {
    // update data bot from server
    const getDataBot = await axios.get('https://bot.jagocode.my.id/api/checkDataBot?ip=' + bot.ip);
    if (getDataBot.data.status) {
      global.bot = getDataBot.data.data;
    }
  }
};

const setDataBot = async data => {
  try {
    if (global.bot.ip === 'local') {
      // update ip
      const getDataServer = await axios.get('https://ipapi.co/json/');
      global.bot.ip = getDataServer.data.ip;
    }

    // update data key
    let dataKey;
    if (!data?.key && key?.key) {
      const updateToken = await axios.get('https://bot.jagocode.my.id/api/checkToken?token=' + key.key);
      dataKey = updateToken.data.data;
    } else {
      dataKey = data;
    }
    global.key = dataKey;
    fs.writeFileSync(pathConfig, JSON.stringify({ token: dataKey.key }, null, 2));

    // update url
    await updateListDomain(dataKey);

    // update proxy
    if (dataKey?.withProxy) {
      await updateListProxy(dataKey.proxy);
    }

    if (dataKey?.customReferer) {
      await updateListReferer(dataKey.referer);
    }

    console.log('\x1b[32m[✓]\x1b[0m Data bot berhasil di perbarui...');
    return true;
  } catch (e) {
    console.log(e);
    console.log('\x1b[31m[!]\x1b[0m Gagal memperbarui data bot!');
    process.exit(1);
  }
};

const updateListDomain = async bot => {
  if (bot.urlType === 'urlFeed') {
    let listLink = [],
      myUrl = bot.urlFeed;
    const getLink = await axios.get(myUrl + '/feeds/posts/default?alt=json&max-results=200');
    listLink.push(myUrl);
    getLink.data.feed.entry.forEach(x => {
      listLink.push(x.link[4].href);
    });
    fs.writeFileSync(pathDataUrl, JSON.stringify(listLink, null, 2), 'utf8');
  } else {
    fs.writeFileSync(pathDataUrl, JSON.stringify(bot.urlManual, null, 2), 'utf8');
  }
};

const updateListProxy = proxys => {
  if (proxys?.length) {
    const jsonProxy = JSON.stringify(proxys, null, 2);
    fs.writeFileSync(pathDataProxy, jsonProxy);
  }
};

const updateListReferer = referer => {
  if (referer?.length) {
    const jsonReferer = JSON.stringify(referer, null, 2);
    fs.writeFileSync(pathDataReferer, jsonReferer);
  }
};

const checkProxyConnection = async proxyUrl => {
  try {
    const response = await axios.get('https://ipapi.co/json/', {
      proxy: {
        host: proxyUrl.split(':')[0],
        port: parseInt(proxyUrl.split(':')[1])
      }
    });
    console.log('Proxy connection successful.');
    return true;
  } catch (error) {
    console.error('Proxy connection failed:', error.message);
    return false;
  }
};

// bot module
const scrollDown = async page => {
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
};

const scrollUpSlowly = async page => {
  await page.evaluate(async () => {
    let scrollY = window.scrollY;
    while (scrollY > 0) {
      window.scrollBy(0, -2);
      await new Promise(resolve => setTimeout(resolve, 100));
      scrollY = window.scrollY;
    }
  });
};

const getVisibleAdsCount = async page => {
  return await page.evaluate(() => {
    const ads = document.querySelectorAll('.adsbygoogle');
    let visibleAdsCount = 0;
    ads.forEach(ad => {
      const adRect = ad.getBoundingClientRect();
      if (adRect.top >= 0 && adRect.bottom <= window.innerHeight) {
        visibleAdsCount++;
      }
    });
    return visibleAdsCount;
  });
};

const clickAds = async (page, selector) => {
  try {
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    await element.click();
    bot.totalClickAds++;
    bot.totalClickAdsPerDay++;
    console.log('\x1b[32m[✓]\x1b[0m Berhasil klik iklan.');
  } catch {
    console.log('\x1b[31m[!]\x1b[0m Gagal klik iklan!');
  }
};

// const waitForAdSense = async function (page) {
//   try {
//     await page.waitForSelector('.adsbygoogle', { visible: true, timeout: 20000 });
//     console.log('\x1b[32m[+]\x1b[0m AdSense ready.');
//   } catch (e) {
//     console.log('\x1b[31m[!]\x1b[0m AdSense blank!!');
//   }
// }

// const waitForCTA = async function (page, name) {
//   try {
//     await page.waitForSelector('.fc-button', { timeout: 10000 });
//     await page.click('button.fc-button.fc-vendor-preferences-accept-all.fc-secondary-button');
//     await page.click('button.fc-button.fc-cta-consent.fc-primary-button');
//     console.log('\x1b[32m[+]\x1b[0m [', name, '] CTA clicked.');
//   } catch (e) {
//     // console.log('\x1b[31m[!]\x1b[0m [', name, ']', e.message);
//     console.log('\x1b[31m[!]\x1b[0m [', name, '] CTA not found!');
//   }
// }

// cron job
cron.schedule('*/2 * * * *', () => {
  bot.uptime = util.formatUptime(process.uptime());
  pidusage(process.pid, async (err, stats) => {
    if (err) {
      console.error('Error getting process usage:', err.message);
    } else {
      bot.cpu = stats.cpu.toFixed(2) + ' %';
      bot.memory = (stats.memory / (1024 * 1024)).toFixed(2) + ' Mb';
    }
  });
});

cron.schedule(
  '*/7 * * * *',
  () => {
    if (global?.bot?.key && global?.key?.key) {
      postDataBot();
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  }
);

cron.schedule(
  '25 17 * * *',
  async () => {
    await setDataBot();
    await updateDataBot();
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  }
);

module.exports = {
  setDataBot,
  updateDataBot,
  postDataBot,
  scrollDown,
  scrollUpSlowly,
  getVisibleAdsCount,
  clickAds,
  ask
};
