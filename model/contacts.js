const db = require('./db');
const { ObjectID } = require('mongodb');

async function getCollection(db, name) {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
}

async function listContacts() {
  const collection = await getCollection(db, 'contacts');
  const results = await collection.find({}).toArray();
  return results;
}

async function getContactById(contactId) {
  const collection = await getCollection(db, 'contacts');
  const objectId = new ObjectID(contactId);
  const [result] = await collection.find({ _id: objectId }).toArray();
  return result;
}

async function removeContact(contactId) {
  const collection = await getCollection(db, 'contacts');
  const objectId = new ObjectID(contactId);
  const { value: result } = await collection.findOneAndDelete({
    _id: objectId,
  });
  return result;
}

async function addContact({ name, email, phone }) {
  const newContact = {
    name,
    email,
    phone,
  };
  const collection = await getCollection(db, 'contacts');
  const {
    ops: [result],
  } = await collection.insertOne(newContact);
  return result;
}

async function updateContact(contactId, reqBody) {
  const collection = await getCollection(db, 'contacts');
  const objectId = new ObjectID(contactId);
  const { value: result } = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: reqBody },
    { returnOriginal: false },
  );
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
