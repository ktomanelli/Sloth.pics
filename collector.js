require('dotenv').config();
const base64 = require('node-base64-image');
const gis = require('g-i-s');
const download = require('image-downloader');
const aws = require('./aws');

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
  return download
    .image(options)
    .then(({ filename }) => {
      console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
      return true;
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

async function downloadAndUploadToS3(sloth) {
  if (await downloadImage(sloth.url, './temp/image.jpg')) {
    const uniqeName = await aws.uploadPic('./temp/image.jpg');
    sloth.s3Name = `${uniqeName}.jpg`;
    const labels = await aws.getLabels(sloth.s3Name);
    if (await aws.checkIfSloth(labels, sloth)) {
      // console.log(sloth.s3Name);
      await aws.copyObj(sloth.s3Name);
      await aws.deleteObj(sloth.s3Name);
    }
  }
}

async function startCollecting() {
  const sloths = await collectSloths();

  for (let i = 0; i < sloths.length; i += 1) {
    try {
      await downloadAndUploadToS3(sloths[i]);
    } catch (e) {
      console.log(e);
    }
  }
}
