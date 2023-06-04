const Author = require('../models/author');
const Book = require('../models/book');
const asyncHandler = require("express-async-handler");
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './resources/images/')
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

const { body,validationResult } = require('express-validator');

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
    res.render("author_list", {
        title: "Author List",
        author_list: allAuthors,
    });
});

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.render("author_detail", {
        title: "Author Detail",
        author: author,
        author_books: allBooksByAuthor,
    });
});


// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
    res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST.
exports.author_create_post = [

    upload.single('image'),

    // Validate and sanitize fields.
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('image_path', 'Invalid image')
        .optional({checkFalsy: true})
        .isString(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: author, errors: errors.array() });
            return;
        } else {
            // Data from form is valid.
            let defaultImagePath = "resources\\images\\Default_pfp.png"

            // Create an Author object with escaped and trimmed data.
            let author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death,
                    image_path: req.file ? req.file.path : defaultImagePath
                });
            await author.save();
            // Redirect to new author record.
            res.redirect(author.url);
        }
    }),
];


// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
        // No results.
        res.redirect("/catalog/authors");
    }

    res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: allBooksByAuthor,
    });
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (allBooksByAuthor.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("author_delete", {
            title: "Delete Author",
            author: author,
            author_books: allBooksByAuthor,
        });
        return;
    } else {
        // Author has no books. Delete object and redirect to the list of authors.
        await Author.findByIdAndRemove(req.body.authorid);
        res.redirect("/catalog/authors");
    }
});

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};