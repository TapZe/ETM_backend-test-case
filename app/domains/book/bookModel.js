const mongoose = require('mongoose');

const copySchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    isBorrowed: { type: Boolean, default: false }
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
        type: [copySchema]
    }
});

module.exports = mongoose.model('Book', bookSchema);

