require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;

const dbName = 'slothdb';

function dbConnect(callback, options = {}) {
  MongoClient.connect(url, (err, client) => {
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

module.exports = { appendDb };
