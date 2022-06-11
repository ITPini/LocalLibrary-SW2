var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
});

// Generate full name of first_name and family_name
AuthorSchema.virtual('name').get(function() {
    var fullname = '';
    if (this.first_name && this.family_name) {
        fullname = this.first_name + ' ' + this.family_name;
    }
    // In case of error
    if (!this.first_name && !this.family_name) {
        fullname = '';
    }
    return fullname;
});

// Generate life span of date of birth and death
AuthorSchema.virtual('lifespan').get(function() {
    var lifetime_string = '';
    if (this.date_of_birth) {
        lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    }
    lifetime_string += ' - ';
    if (this.date_of_death) {
        lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    }
    return lifetime_string;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
});
  
AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); //format 'YYYY-MM-DD'
});

// Generate url of identity
AuthorSchema.virtual('url').get(function() {
    return "/catalog/author/" + this._id;
});

// Export module
module.exports = mongoose.model('Author', AuthorSchema);