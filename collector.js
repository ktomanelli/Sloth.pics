require('dotenv').config();
const base64 = require('node-base64-image');
const gis = require('g-i-s');
const download = require('image-downloader');

// runs google image search for 'sloth' and returns images array
function collectSloths() {
  return new Promise((resolve, reject) =>
    gis('sloth', (err, res) => {
      if (err) reject(err);
      return resolve(res);
    })
  );
}
function downloadImage(url, dest) {
  const options = {
    url,
    dest,
  };
  download
    .image(options)
    .then(({ filename }) => {
      console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
    })
    .catch(err => console.error(err));
}

// download image from url and encodes as base64 string
function downloadAndEncode(url) {
  const options = {
    string: true,
    headers: {
      'User-Agent': 'Sloth.Pics',
    },
  };
  try {
    return base64.encode(url, options);
  } catch (e) {
    console.log(e);
  }
}

// accepts a base64 string and decodes to a jpg
async function decode(str, fname, ext = 'jpg') {
  return base64.decode(str, { fname, ext });
}

// async function getSloth() {
//   const sloths = await collectSloths();
//   return downloadAndEncode(await sloths[0].url);
// }

// async function start() {
//   const b64img = await getSloth();
//   decode(b64img);
// }

// start();
module.exports = { collectSloths, downloadAndEncode, decode };
