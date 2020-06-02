const aws = require('./aws');
const db = require('./db');
const collector = require('./collector');

async function downloadAndUploadToS3(sloth) {
  if (await collector.downloadImage(sloth.url, './temp/image.jpg')) {
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
  const sloths = await collector.collectSloths();

  for (let i = 0; i < sloths.length; i += 1) {
    try {
      await downloadAndUploadToS3(sloths[i]);
    } catch (e) {
      console.log(e);
    }
  }
}
startCollecting();
