const express = require('express');
const BookController = require('./bookController');

const router = express.Router();

// Routes for each of the controller
router.get('/', BookController.getAllBookAvailable);
router.get('/:code', BookController.getBookByCode);
router.post('/', BookController.createBook);
router.put('/:code', BookController.updateBook);
router.delete('/:code', BookController.deleteBook);
router.delete('/:bookCode/copies/:copyCode', BookController.deleteCopyFromBook);

module.exports = router;
