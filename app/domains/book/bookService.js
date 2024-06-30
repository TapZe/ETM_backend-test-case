const BookRepository = require('./bookRepository');

class BookService {
    async getAllBookAvailable() {
        return await BookRepository.getAllBookAvailable();
    }

    async getBookByCode(code) {
        return await BookRepository.getBookByCode(code);
    }

    async createBook(bookData) {
        return await BookRepository.createBook(bookData);
    }

    async updateBook(code, updateData) {
        return await BookRepository.updateBook(code, updateData);
    }

    async deleteBook(code) {
        return await BookRepository.deleteBook(code);
    }

    async deleteCopyFromBook(bookCode, copyCode) {
        return await BookRepository.deleteCopyFromBook(bookCode, copyCode);
    }

    async checkBorrowedBook(bookCode, copyCode) {
        return await BookRepository.checkBorrowedBook(bookCode, copyCode);
    }

    async updateBorrowedBook(bookCode, copyCode) {
        return await BookRepository.updateBorrowedBook(bookCode, copyCode);
    }

    async checkReturnedBook(bookCode, copyCode) {
        return await BookRepository.checkReturnedBook(bookCode, copyCode);
    }

    async updateReturnedBook(bookCode, copyCode) {
        return await BookRepository.updateReturnedBook(bookCode, copyCode);
    }
}

module.exports = new BookService();
