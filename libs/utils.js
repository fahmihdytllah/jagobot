module.exports.getRandom = array => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

module.exports.secondsToHours = seconds => {
  var hours = Math.floor(seconds / 3600);
  var remainingSeconds = seconds % 3600;
  var minutes = Math.floor(remainingSeconds / 60);
  var remainingSeconds = remainingSeconds % 60;

  return hours + ' h ' + minutes + ' m ' + remainingSeconds + ' s';
};

module.exports.formatUptime = sec => {
  function pad(s) {
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(sec / (60 * 60));
  var minutes = Math.floor((sec % (60 * 60)) / 60);
  var sec = Math.floor(sec % 60);

  return pad(hours) + ' h ' + pad(minutes) + ' m ' + pad(sec) + ' s';
};

module.exports.listReferer = ['https://www.google.com', 'https://www.youtube.com', 'https://www.facebook.com', 'https://www.instagram.com', 'https://www.twitter.com', 'https://www.baidu.com', 'https://www.wikipedia.org', 'https://www.yahoo.com', 'https://www.yandex.ru', 'https://www.whatsapp.com', 'https://www.amazon.com', 'https://www.tiktok.com', 'https://www.reddit.com', 'https://www.linkedin.com', 'https://www.microsoftonline.com', 'https://www.bing.com', 'https://www.vk.com', 'https://www.pinterest.com', 'https://www.discord.com', 'https://www.microsoft.com', 'https://www.duckduckgo.com', 'https://www.quora.com', 'https://www.ebay.com'];
