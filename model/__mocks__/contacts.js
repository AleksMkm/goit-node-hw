const { contacts } = require('./data');

const listContacts = jest.fn(
  (userId, { sortBy, cat, sortByDesc, filter, limit = '5', page = '1' }) => {
    return { contacts, total: contacts.length, limit, page };
  },
);

const getContactById = jest.fn(contactId => {
  const [contact] = contacts.filter(
    contact => String(contact._id) === String(contactId),
  );
  return contact;
});

const addContact = jest.fn(body => {
  const newContact = { ...body, _id: '6043ba3ebcd1859d642fc601' };
  contacts.push(newContact);
  return newContact;
});

const removeContact = jest.fn(contactId => {
  const index = contacts.findIndex(
    contact => String(contact._id) === String(contactId),
  );
  if (index === -1) {
    return null;
  }
  const [contact] = contacts.splice(index, 1);
  return contact;
});

const updateContact = jest.fn((contactId, reqBody) => {
  const [contact] = contacts.filter(
    contact => String(contact._id) === String(contactId),
  );
  if (!contact) {
    return null;
  }
  const updatedContact = { ...contact, ...reqBody };
  return updatedContact;
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
