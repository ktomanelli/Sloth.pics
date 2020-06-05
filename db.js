require('dotenv').config();
const { MongoClient } = require('mongodb');

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
        res.status(200).send({
          url: doc.url,
          width: doc.width,
          height: doc.height,
          labels: doc.labels,
          creator: doc.creator,
          creator_url: doc.creator_url,
          detail_url: doc.detail_url,
          fields_matched: doc.fields_matched,
          foreign_landing_url: doc.foreign_landing_url,
          id: doc.id,
          license: doc.license,
          license_url: doc.license_url,
          license_version: doc.license_version,
          related_url: doc.related_url,
          source: doc.source,
          tags: doc.tags,
          thumbnail: doc.thumbnail,
          title: doc.title,
        })
      );
  });
  next();
}

module.exports = { appendDb, getRandom };
