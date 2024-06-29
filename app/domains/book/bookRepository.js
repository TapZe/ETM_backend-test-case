const Book = require('./bookModel');

class BookRepository {
    async getAllBookAvailable() {
        try {
            let books = await Book.find({}, {__v:0, _id:0}).sort({ code:1 });

            // Sorting the copies by code inside the copies
            books = books.map(book => ({
                code: book.code,
                title: book.title,
                author: book.author,
                stock: book.stock,
                copies: book.copies.sort((a, b) => a.code.localeCompare(b.code))
            }));
            
            return books;
        } catch (error) {
            throw new Error(`Failed to fetch books with quantities: ${error.message}`);
        }
    }

    async getBookByCode(code) {
        try {
            let book = await Book.findOne({ code }, { _id: 0, __v: 0 });

            if (!book) {
                throw new Error(`Book with code ${code} not found`);
            }

            // Sorting the copies by code inside the copies
            book.copies.sort((a, b) => a.code.localeCompare(b.code));

            return book;
        } catch (error) {
            throw new Error(`Failed to fetch book with code ${code}: ${error.message}`);
        }
    }

    async createBook(bookData) {
        try {
            const newBook = new Book(bookData);
            await newBook.save();
            return newBook;
        } catch (error) {
            throw new Error(`Failed to create book: ${error.message}`);
        }
    }

    async updateBook(code, updateData) {
        try {
            const book = await Book.findOne({ code });

        if (!book) {
            throw new Error(`Book with code ${code} not found.`);
        }

        // Update each copy individually
        updateData.copies.forEach(updateCopy => {
            const copyIndex = book.copies.findIndex(copy => copy.code === updateCopy.code);
            // Update existing copy
            if (copyIndex !== -1) {
                book.copies[copyIndex].isBorrowed = updateCopy.isBorrowed;
            } else { // Add new copy if not found
                book.copies.push({ code: updateCopy.code, isBorrowed: updateCopy.isBorrowed });
            }
        });

        // Save the updated book
        const updatedBook = await book.save();
        return updatedBook;
        } catch (error) {
            throw new Error(`Failed to update book with code ${code}: ${error.message}`);
        }
    }

    async deleteBook(code) {
        try {
            return await Book.findOneAndDelete(code);
        } catch (error) {
            throw new Error(`Failed to delete book with code ${code}: ${error.message}`);
        }
    }

    async deleteCopyFromBook(bookCode, copyCode) {
        try {
            const updatedBook = await Book.findOneAndUpdate(
                { code: bookCode },
                { $pull: { copies: { code: copyCode } } },
                { new: true }
            );
            return updatedBook;
        } catch (error) {
            throw new Error(`Failed to delete copy with code ${copyCode} from book with code ${bookCode}: ${error.message}`);
        }
    }

    async updateBorrowedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            if (!book) {
                throw new Error(`Book with code ${bookCode} not found`);
            }

            // Check if the said copy is already borrowed
            const copy = book.copies.find(copy => copy.code === copyCode);
            if (!copy) {
                throw new Error(`Copy with code ${copyCode} not found`);
            }

            if (copy.isBorrowed) {
                throw new Error(`Book copy with code ${copyCode} is already borrowed`);
            }

            // Update the copy's isBorrowed status
            copy.isBorrowed = true;
            await book.save();
            return book;
        } catch (error) {
            throw new Error(`Failed to update book with code ${bookCode}: ${error.message}`);
        }
    }

    async updateReturnedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            if (!book) {
                throw new Error(`Book with code ${bookCode} not found`);
            }

            // Check if the said copy is not borrowed
            const copy = book.copies.find(copy => copy.code === copyCode);
            if (!copy) {
                throw new Error(`Copy with code ${copyCode} not found`);
            }

            if (!copy.isBorrowed) {
                throw new Error(`Book copy with code ${copyCode} is not borrowed`);
            }

            // Update the copy's isBorrowed status
            copy.isBorrowed = false;
            await book.save();
            return book;
        } catch (error) {
            throw new Error(`Failed to update book with code ${bookCode}: ${error.message}`);
        }
    }
}

module.exports = new BookRepository();
