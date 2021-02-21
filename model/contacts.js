const fs = require('fs/promises');
const path = require('path');

const { v4: uuid } = require('uuid');

const { handleError } = require('../lib/errorHandler');

const contactsPath = path.resolve('model/contacts.json');

// console.log(`path to contacts.json: ${contactsPath}`);

const encoding = 'utf8';

async function readContacts() {
  try {
    const result = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(result);
    return contacts;
  } catch (error) {
    handleError(error);
  }
}

async function listContacts() {
  try {
    const contacts = await readContacts();
    return contacts;
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const requiredContact = contacts.filter(
      contact => contact.id === +contactId,
    );
    return requiredContact;
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    if (contacts.find(contact => contact.id === contactId)) {
      console.log('there is a contact which has to be removed');
      const updatedContactList = contacts.filter(
        contact => contact.id !== contactId,
      );
      await fs.writeFile(contactsPath, JSON.stringify(updatedContactList));
      console.log(`contact with id ${contactId} was deleted`);
      listContacts();
      return;
    }
    console.log("there no contact with such id, therefore it can't be deleted");
    listContacts();
  } catch (error) {
    handleError(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const newContact = { id: generateId(), name, email, phone };
    const updatedContactList = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContactList));
    console.log(`contact ${name} was added succsessfully`);
    listContacts();
  } catch (error) {
    handleError(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
