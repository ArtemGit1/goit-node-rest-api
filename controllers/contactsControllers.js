const contactsService = require("../services/contactsService");
const HttpError = require("../helpers/HttpError");
const Contact = require("../models/contactModel");
const mongoose = require('mongoose');

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};


const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await contactsService.getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    if (!name || !email || !phone) {
      throw new HttpError(400, "All fields (name, email, phone) are required");
    }
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json(new HttpError(400, error.message));
  }
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: "Body must have at least one field" });
  }

  try {
    const updatedContact = await contactsService.updateContact(id, updatedFields);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      throw new HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  } finally {

  }
};



module.exports = { getAllContacts, getOneContact, deleteContact, createContact, updateContact };
