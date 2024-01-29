const contactsService = require('../services/contactsService');
const HttpError = require('../helpers/HttpError');

const updateFavoriteStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    if (favorite === undefined) {
      // Змінилося тут
      res.status(400).json({ message: 'Body must have a "favorite" field' });
      return;
    }

    const updatedContact = await contactsService.updateContact(contactId, { favorite });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      // Змінилося тут
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    // Змінилося тут
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { updateFavoriteStatus };