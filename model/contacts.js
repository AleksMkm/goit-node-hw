const fs = require('fs/promises');
const path = require('path');

const { v4: generateId } = require('uuid');

const contactsPath = path.resolve('model/contacts.json');

// console.log(`path to contacts.json: ${contactsPath}`);

const encoding = 'utf8';

async function readContacts() {
  const result = await fs.readFile(contactsPath, encoding);
  const contacts = JSON.parse(result);
  return contacts;
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const requiredContact = contacts.filter(contact => contact.id === +contactId);
  return requiredContact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const contactToDelete = contacts.filter(contact => contact.id === +contactId);
  const updatedContactList = contacts.filter(
    contact => contact.id !== +contactId,
  );
  await fs.writeFile(contactsPath, JSON.stringify(updatedContactList, null, 2));
  return contactToDelete;
}

async function addContact({ name, email, phone }) {
  const contacts = await readContacts();
  const newContact = { id: generateId(), name, email, phone };
  const updatedContactList = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(updatedContactList, null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
