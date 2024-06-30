const mongoose = require('mongoose');

const copySchema = new mongoose.Schema({
    code: { type: String, required: true },
    isBorrowed: { type: Boolean, default: false },
    softDelete: { type: Boolean, default: false }
}, { _id: false });

const bookSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    stock: {
        type: Number, required: true, default: 1,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: props => `${props.value} is not a valid stock number! Stock must be a non-negative number.`
        }
    }, 
    copies: {
        type: [copySchema],
        validate: {
            validator: function (v) {
                const copyCodes = v.map(copy => copy.code);
                return new Set(copyCodes).size === copyCodes.length;
            },
            message: props => `Duplicate copy codes found in book ${props.value}`
        }
    },
    softDelete: { type: Boolean, default: false }
});

bookSchema.index({ 'code': 1, 'copies.code': 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);

