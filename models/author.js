const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    date_of_birth: Date,
    date_of_death: Date
});

// Generate full name of first_name and last_name
authorSchema.virtual("full_name").get(function() {
    return this.first_name + " " + this.last_name;
});

// Generate url of identity
authorSchema.virtual("url").get(function() {
    return "/catalog/author/" + this._id;
});

// Generate life span of date of birth and death
authorSchema.virtual("life_span").get(function() {
    return this.date_of_birth + " - " + this.date_of_death;
});

// Export module
module.exports = mongoose.model("Author", authorSchema);