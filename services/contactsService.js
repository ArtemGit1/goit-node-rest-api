const mongoose = require('mongoose');
const Contact = require('../models/contactModel');
const HttpError = require('../helpers/HttpError');

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw error;
  }
};


const getContactById = async (contactId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new HttpError('Invalid contact ID');
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw new HttpError('Contact not found');
    }

    return contact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new HttpError(400, 'Invalid contact ID');
    }

    const removedContact = await Contact.findOneAndDelete({ _id: contactId });

    if (!removedContact) {
      throw new HttpError(404, 'Contact not found');
    }

    return removedContact;
  } catch (error) {
    throw new HttpError(error.statusCode || 500, error.message);
  }
};


const addContact = async (name, email, phone) => {
  try {
    const newContact = await Contact.create({ name, email, phone });
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, updatedFields) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new HttpError(400, 'Invalid contact ID');
    }

    const contact = await Contact.findByIdAndUpdate(contactId, updatedFields, { new: true });

    if (!contact) {
      throw new HttpError(404, 'Contact not found');
    }

    return contact;
  } catch (error) {
    throw new HttpError(error.statusCode || 500, error.message);
  }
};

module.exports = { listContacts, getContactById, removeContact, addContact, updateContact };
