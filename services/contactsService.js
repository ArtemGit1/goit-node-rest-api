const Contact = require('../models/contactModel');

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove(contactId);
  } catch (error) {
    throw error;
  }
};

const addContact = async (name, email, phone) => {
  try {
    return await Contact.create({ name, email, phone });
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, updatedFields) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, updatedFields, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports = { listContacts, getContactById, removeContact, addContact, updateContact };
