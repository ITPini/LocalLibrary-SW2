var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, maxLength: 1000},
    isbn: {type: String, required: true, maxLength: 13}, // Room for ISBN-13
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre', required: true, maxLength: 50}],
});

// Generate url for book    
BookSchema.virtual('url').get(function() {
    return "/catalog/book/" + this._id;
});

// Export module
module.exports = mongoose.model('Book', BookSchema);