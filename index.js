const aws = require('./aws');
const db = require('./db');
const collector = require('./collector');

async function downloadAndUploadToS3(sloth) {
  if (await collector.downloadImage(sloth.url, './temp/image.jpg')) {
    await aws.uploadPic('./temp/image.jpg').then(data => {
      sloth.s3Name = `${data}.jpg`;
      //   console.log(sloth.s3Name);
      //   aws.getObj(sloth.s3Name);
      aws.getLabels(sloth.s3Name);
    });
  }
}

async function start() {
  const sloths = await collector.collectSloths();

  await downloadAndUploadToS3(sloths[0]);
  for (let i = 0; i < sloths.length; i += 1) {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}

start();
