const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
    copyCode: { type: String, ref: 'Book.copies.code' },
    bookCode: { type: String, ref: 'Book.code' },
    borrowedAt: { type: Date, default: Date.now }
}, { _id: false });

const memberSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true},
    name: { type: String, required: true },
    booksBorrowed: [borrowedBookSchema],
    penalizedUntil: { type: Date, default: null }
});

module.exports = mongoose.model('Member', memberSchema);
