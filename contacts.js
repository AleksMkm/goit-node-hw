import * as fs from 'fs/promises';
import * as path from 'path';

import { v4 as generateId } from 'uuid';

import { exitCode, handleError } from './lib/errorHandler.js';

const contactsPath = path.resolve('db/contacts.json');

console.log(`path to contacts.json: ${contactsPath}`);

const encoding = 'utf8';

export async function listContacts() {
  try {
    const result = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(result);
    console.table(contacts);
  } catch (error) {
    handleError(error);
  }
}

// listContacts();

export async function getContactById(contactId) {
  try {
    const result = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(result);
    const requiredContact = contacts.filter(
      contact => contact.id === contactId,
    );
    console.table(requiredContact);
  } catch (error) {
    handleError(error);
  }
}

// getContactById(7);

export async function removeContact(contactId) {
  try {
    const result = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(result);
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

// removeContact(6);

export async function addContact(name, email, phone) {
  try {
    const result = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(result);
    const newContact = { id: generateId(), name, email, phone };
    const updatedContactList = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContactList));
    console.log(`contact ${name} was added succsessfully`);
    listContacts();
  } catch (error) {
    handleError(error);
  }
}

// addContact('test', 'test@test.test', '1234567');
