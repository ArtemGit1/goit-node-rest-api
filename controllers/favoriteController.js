const contactsService = require('../services/contactsService');

const HttpError = require('../helpers/HttpError');

const updateFavoriteStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {

    if (favorite === undefined) {
      throw new HttpError(400, 'Body must have a "favorite" field');
    }


    const updatedContact = await contactsService.updateContact(contactId, { favorite });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json(new HttpError(404, 'Not found'));
    }
  } catch (error) {
    res.status(error.statusCode || 500).json(new HttpError(error.statusCode || 500, error.message));
  }
};

module.exports = { updateFavoriteStatus };
