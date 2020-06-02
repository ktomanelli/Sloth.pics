require('dotenv').config();
const { MongoClient } = require('mongodb');
const aws = require('./aws');

const url = process.env.MONGODB_URL;

const dbName = 'slothdb';

function dbConnect(callback, options = {}) {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      client.close();
    }
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    if (options === {}) callback(db);
    else callback(db, options);
    client.close();
  });
}

function insertDocument(db, doc) {
  const collection = db.collection('documents');
  try {
    collection.insertOne(doc);
  } catch (e) {
    console.log(e);
  }
}
function insertDocuments(db, docs) {
  const collection = db.collection('documents');
  try {
    collection.insertMany(docs);
  } catch (e) {
    console.log(e);
  }
}

function appendDb(item) {
  if (Array.isArray(item)) {
    dbConnect(insertDocuments, item);
  } else {
    dbConnect(insertDocument, item);
  }
}

function getRandom(req, res, next) {
  dbConnect(db => {
    db.collection('documents')
      .aggregate([{ $sample: { size: 1 } }])
      .forEach(doc =>
        res.status(200).send(
          `
            <style>
            img{
              height:100%;
            }
            </style>
            <img src = 'https://sloths.s3.amazonaws.com/confirmedsloths/${doc.s3Name.toString()}'>
            `
        )
      );
  });
  next();
}

// getRandom();

module.exports = { appendDb, getRandom };
