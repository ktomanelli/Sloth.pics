const aws = require('./aws');
const db = require('./db');
const collector = require('./collector');

async function start() {
  const sloths = await collector.collectSloths();

  //   for (let i = 0; i < sloths.length; i += 1) {
  //     try {
  //       sloths[i].base64 = await collector.downloadAndEncode(sloths[i].url);
  //       //   db.appendDb(sloths[i]);
  //       aws.getLabels(sloths[i].base64);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  sloths[0].base64 = await collector.downloadAndEncode(sloths[0].url);
  aws.getLabels(sloths[0].base64);
}

start();
