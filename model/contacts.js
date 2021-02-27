const Contact = require('./schemas/contact');

async function listContacts() {
  const results = await Contact.find({});
  return results;
}

async function getContactById(contactId) {
  const result = await Contact.findOne({ _id: contactId });
  return result;
}

async function addContact(body) {
  const result = await Contact.create(body);
  return result;
}

async function removeContact(contactId) {
  const result = await Contact.findByIdAndDelete({ _id: contactId });
  return result;
}

async function updateContact(contactId, reqBody) {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...reqBody },
    { new: true },
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
