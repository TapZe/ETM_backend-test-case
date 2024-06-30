const BookService = require('../book/bookService');
const MemberService = require('./memberService');

// Get all members
exports.getAllMembers = async (req, res) => {
    try {
        const members = await MemberService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a member by code
exports.getMemberByCode = async (req, res) => {
    try {
        const member = await MemberService.getMemberByCode(req.params.code);
        if (member) {
            res.status(200).json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new member
exports.createMember = async (req, res) => {
    try {
        const { name, code } = req.body;
        const newMember = await MemberService.createMember(name, code);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a member by code
exports.updateMember = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedMember = await MemberService.updateMember(req.params.code, name);
        if (updatedMember) {
            res.status(200).json(updatedMember);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a member by code
exports.deleteMember = async (req, res) => {
    try {
        const deletedMember = await MemberService.deleteMember(req.params.code);
        if (deletedMember) {
            res.status(200).json({ message: 'Member deleted successfully', data: deletedMember});
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
    try {
        const { bookCode, copyCode } = req.body;
        const { code } = req.params;
        
        // Check book
        await BookService.checkBorrowedBook(bookCode, copyCode);

        // Update the borrowing status of the member
        const updatedMember = await MemberService.borrowBook(code, bookCode, copyCode);

        // Update the borrowed status of the book
        const updatedBook = await BookService.updateBorrowedBook(bookCode, copyCode);

        res.status(200).json({ updatedMember, updatedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const { bookCode, copyCode } = req.body;
        const { code } = req.params;

        // Check book
        await BookService.checkReturnedBook(bookCode, copyCode);

        // Update the borrowing status of the member
        const updatedMember = await MemberService.returnBook(code, bookCode, copyCode);

        // Update the borrowed status of the book
        const updatedBook = await BookService.updateReturnedBook(bookCode, copyCode);

        res.status(200).json({ updatedMember, updatedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};