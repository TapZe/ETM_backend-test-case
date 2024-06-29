const BookService = require('./bookService');

// Get all books available
exports.getAllBookAvailable = async (req, res) => {
    try {
        const books = await BookService.getAllBookAvailable();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a book by code
exports.getBookByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const book = await BookService.getBookByCode(code);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new book
exports.createBook = async (req, res) => {
    try {
        const bookData = req.body;
        console.log(bookData);
        const newBook = await BookService.createBook(bookData);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a book by Code
exports.updateBook = async (req, res) => {
    try {
        const { code } = req.params;
        const updateData = req.body;
        const updatedBook = await BookService.updateBook(code, updateData);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a book by code
exports.deleteBook = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedBook = await BookService.deleteBook(code);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCopyFromBook = async (req, res) => {
    try {
        const { bookCode, copyCode } = req.params;
        const updatedBook = await BookService.deleteCopyFromBook(bookCode, copyCode);
        if (!updatedBook) {
            return res.status(404).json({ message: `Book with code ${bookCode} not found or copy with code ${copyCode} not found` });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};