require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const db = require('./db');

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
function deleteObj(s3Name) {
  const params = {
    Bucket: bucketName,
    Key: s3Name,
  };
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      else resolve('Deleted Duplicate');
    });
  });
}
function copyObj(s3Name) {
  const params = {
    Bucket: bucketName,
    CopySource: `${bucketName}/${s3Name}`,
    Key: `confirmedsloths/${s3Name}`,
  };
  return new Promise((resolve, reject) => {
    s3.copyObject(params, (err, data) => {
      if (err) reject(err);
      else resolve('Copied Object');
    });
  });
}

function checkIfSloth(data, sloth) {
  const labels = data.Labels;
  for (let i = 0; i < labels.length; i += 1) {
    if (labels[i].Name === 'Sloth' && labels[i].Confidence > 75) {
      sloth.labels = labels;
      db.appendDb(sloth);
      return true;
    }
  }
  return false;
}

function getLabels(s3Name) {
  const params = {
    Image: {
      S3Object: {
        Bucket: 'sloths',
        Name: s3Name,
      },
    },
  };
  return new Promise((resolve, reject) => {
    rekognition.detectLabels(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function uploadPic(filePath) {
  console.log('inside uploadPic');
  const uniqeName = Date.now();
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: bucketName,
    Key: `${uniqeName}.jpg`,
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

module.exports = {
  getLabels,
  uploadPic,
  getObj,
  checkIfSloth,
  copyObj,
  deleteObj,
};
