const express = require('express');
const router = express.Router();
const Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

router.get('/search', async function(req, res, next) {
    let term = req.query.term;
    let books = await Book.find({title: {$regex: term, $options: 'i'}}).populate('author').exec();
    res.render('search_result', { title: 'Search Results', books: books });
});

module.exports = router;