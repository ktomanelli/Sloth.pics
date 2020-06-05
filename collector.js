require('dotenv').config();
const axios = require('axios');
const download = require('image-downloader');
const aws = require('./aws');

// runs google image search for 'sloth' and returns images array
function collectSloths() {
  return new Promise((resolve, reject) =>
    axios
      .get(
        'https://api.creativecommons.engineering/v1/images/?q=sloth&page_size=500'
      )
      .then(res => {
        resolve(res.data.results);
      })
      .catch(e => {
        reject(e);
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
  console.log('fuk');
  const sloths = await collectSloths();
  for (let i = 0; i < sloths.length; i += 1) {
    try {
      await downloadAndUploadToS3(sloths[i]);
    } catch (e) {
      console.log(e);
    }
  }
}

startCollecting();
// collectSloths();
