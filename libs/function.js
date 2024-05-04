const pidusage = require('pidusage');
const cron = require('node-cron');
const readline = require('readline');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('./utils');

let pathDataDomainJson = path.join(__dirname, '../json/dataUrl.json');
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
    console.log('\x1b[32m[✓]\x1b[0m Data bot berhasil di kirim');
    return true;
  } catch (e) {
    console.log(e);
    console.log('\x1b[31m[!]\x1b[0m Gagal mengirim data bot!');
  }
};

const setDataBot = async data => {
  try {
    if (global.bot.ip === 'local') {
      const getDataServer = await axios.get('https://ipapi.co/json/');
      global.bot.ip = getDataServer.data.ip;
      const getDataBot = await axios.get('https://bot.jagocode.my.id/api/checkDataBot?ip=' + bot.ip);
      global.bot = getDataBot.data.data;
    }

    let dataBot;
    if (!data?.key && key?.key) {
      const updateToken =await axios.get('https://bot.jagocode.my.id/api/checkToken?token=' + key.key);
      dataBot = updateToken.data.data;
    } else {
      dataBot = data;
    }

    global.key = dataBot;
    fs.writeFileSync(pathConfig, JSON.stringify({ token: dataBot.key }, null, 2));
    await updateListDomain(dataBot);
    console.log('\x1b[32m[✓]\x1b[0m Data bot berhasil di perbarui');
    return true;
  } catch (e) {
    console.log(e);
    console.log('\x1b[31m[!]\x1b[0m Gagal memperbarui data bot!');
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
    fs.writeFileSync(pathDataDomainJson, JSON.stringify(listLink, null, 2), 'utf8');
  } else {
    fs.writeFileSync(pathDataDomainJson, JSON.stringify(bot.urlManual, null, 2), 'utf8');
  }
};

const convertProxyToJson = (text, outputFilePath) => {
  const lines = text.split('\n').filter(Boolean);
  const jsonData = lines.map(line => {
    return line;
  });
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync(outputFilePath, jsonString);
  console.log(`Data telah berhasil ditulis ke ${outputFilePath}`);
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
cron.schedule('*/1 * * * *', () => {
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
  '*/5 * * * *',
  () => {
    postDataBot();
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  }
);

cron.schedule(
  '0 0 * * *',
  async () => {
    bot.totalHitsTimePerDay = 0;
    bot.totalHitsPerDay = 0;
    bot.totalClickAdsPerDay = 0;
    bot.totalErrorPerDay = 0;
    bot.totalViewAdsPerDay = 0;
    setDataBot();
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  }
);

module.exports = {
  setDataBot,
  postDataBot,
  scrollDown,
  scrollUpSlowly,
  getVisibleAdsCount,
  clickAds,
  ask
};
