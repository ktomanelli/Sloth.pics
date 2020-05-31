require('dotenv').config();
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
function getLabels(imgString) {
  const params = {
    Image: {
      Bytes: imgString,
    },
    MaxLabels: 10,
    MinConfidence: 75,
  };
  rekognition.detectLabels(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
}
s3.listObjects({ Delimiter: '/' }, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});

function uploadPics() {
  const albumPhotosKey = `${encodeURIComponent('potentialsloths')}//`;
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: photoKey,
      Body: file,
      ACL: 'public-read',
    },
  });
}

module.exports = { getLabels };
