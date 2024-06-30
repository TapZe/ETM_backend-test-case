const Book = require('./bookModel');

class BookRepository {
    async getAllBookAvailable() {
        try {
            let books = await Book.find({ softDelete:false }, {__v:0, _id:0}).sort({ code:1 });

            // Sorting the copies by code inside the copies
            books = books.map(book => ({ // Shows all existing books and quantities
                code: book.code,
                title: book.title,
                author: book.author,
                stock: book.stock, // Books that are being borrowed are not counted
                copies: book.copies
                    .filter(copy => !copy.softDelete) // Filter out deleted copies
                    .sort((a, b) => a.code.localeCompare(b.code)) // Sort copies by code
                    .map(copy => ({ code: copy.code, isBorrowed: copy.isBorrowed })) // Placement inside of the copy
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
            book.copies.filter(copy => !copy.softDelete).sort((a, b) => a.code.localeCompare(b.code));

            return book;
        } catch (error) {
            throw new Error(`Failed to fetch book with code ${code}: ${error.message}`);
        }
    }

    async createBook(bookData) {
        try {
            const newBook = new Book(bookData);
            newBook.stock = newBook.copies.length;
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
                    if (book.copies[copyIndex].isBorrowed !== updateCopy.isBorrowed) {
                        if (updateCopy.isBorrowed) { // Borrowing update
                            book.stock--;
                        } else { // Returning update
                            book.stock++;
                        }   
                    }
                    book.copies[copyIndex].isBorrowed = updateCopy.isBorrowed;
                } else { // Add new copy if not found
                    book.copies.push({ code: updateCopy.code, isBorrowed: updateCopy.isBorrowed });
                    if (!updateCopy.isBorrowed) { // Add stock if not borrowed
                        book.stock++;
                    }
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
            const deletedBook = await Book.findOne({ code, softDelete:false });

            if (!deletedBook) {
                throw new Error(`Book with code ${code} not found`);
            }

            deletedBook.softDelete = true;
            deletedBook.save();
            return deletedBook;
        } catch (error) {
            throw new Error(`Failed to delete book with code ${code}: ${error.message}`);
        }
    }

    async deleteCopyFromBook(bookCode, copyCode) {
        try {
            const deletedBookCopy = await Book.findOne({ code: bookCode });

            if (!deletedBookCopy) {
                throw new Error(`Book with code ${bookCode} not found`);
            }

            const copyIndex = deletedBookCopy.copies.findIndex(copy => copy.code === copyCode);
            if (copyIndex === -1) {
                throw new Error(`Copy with code ${copyCode} not found in book with code ${bookCode}`);
            }

            // Soft delete the copy
            deletedBookCopy.copies[copyIndex].deleted = true;
            await deletedBookCopy.save();
            return deletedBookCopy;
        } catch (error) {
            throw new Error(`Failed to delete copy with code ${copyCode} from book with code ${bookCode}: ${error.message}`);
        }
    }

    async checkBorrowedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            
            if (!book) {
                throw new Error(`Book with code ${bookCode} not found`);
            }
            
            const copy = book.copies.find(copy => copy.code === copyCode);
            if (!copy) {
                throw new Error(`Copy with code ${copyCode} not found`);
            }

            // Borrowed books are not borrowed by other members
            // Check if book is already borrowed
            if (copy.isBorrowed) {
                throw new Error(`Book copy with code ${copyCode} is already borrowed`);
            }
        } catch (error) {
            throw new Error(`Failed to check book with code ${bookCode}: ${error.message}`);
        }
    }

    async updateBorrowedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            const copy = book.copies.find(copy => copy.code === copyCode);

            // Update the copy's isBorrowed status
            copy.isBorrowed = true;
            book.stock--;
            await book.save();
            return book;
        } catch (error) {
            throw new Error(`Failed to update book with code ${bookCode}: ${error.message}`);
        }
    }

    async checkReturnedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            
            if (!book) {
                throw new Error(`Book with code ${bookCode} not found`);
            }
            
            const copy = book.copies.find(copy => copy.code === copyCode);
            if (!copy) {
                throw new Error(`Copy with code ${copyCode} not found`);
            }

            // Check if the said copy is not borrowed
            if (!copy.isBorrowed) {
                throw new Error(`Book copy with code ${copyCode} is not borrowed`);
            }
        } catch (error) {
            throw new Error(`Failed to check book with code ${bookCode}: ${error.message}`);
        }
    }

    async updateReturnedBook(bookCode, copyCode){
        try {
            const book = await Book.findOne({ code: bookCode });
            const copy = book.copies.find(copy => copy.code === copyCode);
            
            // Update the copy's isBorrowed status
            copy.isBorrowed = false;
            book.stock++;
            await book.save();
            return book;
        } catch (error) {
            throw new Error(`Failed to update book with code ${bookCode}: ${error.message}`);
        }
    }
}

module.exports = new BookRepository();
