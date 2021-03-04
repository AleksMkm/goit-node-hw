const Contact = require('./schemas/contact');

async function listContacts(userId) {
  const results = await Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return results;
}

async function getContactById(contactId, userId) {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
}

async function addContact(body) {
  const result = await Contact.create(body);
  return result;
}

async function removeContact(contactId, userId) {
  const result = await Contact.findByIdAndDelete({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
}

async function updateContact(contactId, reqBody, userId) {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...reqBody },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
