require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');

if (!AWS.config.region) {
  AWS.config.update({
    region: 'us-east-1',
  });
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const rekognition = new AWS.Rekognition();
const bucketName = 'sloths';
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: bucketName },
});
function getLabels(s3Name) {
  const params = {
    Image: {
      S3Object: {
        Bucket: 'sloths',
        Name: s3Name,
      },
    },
  };
  rekognition.detectLabels(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
}
// s3.listObjects({ Delimiter: '/' }, (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });

function uploadPic(filePath, confirmed = false) {
  const uniqeName = Date.now();
  const fileContent = fs.readFileSync(filePath);
  let albumPhotosKey = '';
  if (confirmed) {
    albumPhotosKey = `${encodeURIComponent('confirmedsloths')}/`;
  }
  const params = {
    Bucket: bucketName,
    Key: `${albumPhotosKey}${uniqeName}.jpg`,
    Body: fileContent,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(`File uploaded successfully.`);
      return resolve(uniqeName);
    });
  });
}
function getObj(s3Name, confirmed = false) {
  let albumPhotosKey = '';

  if (confirmed) {
    albumPhotosKey = `${encodeURIComponent('confirmedsloths')}/`;
  }
  const params = {
    Bucket: bucketName,
    Key: `${albumPhotosKey}${s3Name}`,
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else console.log(data);
  });
}

module.exports = { getLabels, uploadPic, getObj };
