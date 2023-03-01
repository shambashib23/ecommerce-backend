const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allCategoriesSchema = new Schema({
    categories: [
        {
            title: {
                type: String,
                required: true,
                unique: true
            },
            subcategories: [
                {
                    title: {
                        type: String,
                        required: true,
                        unique: true // make title unique for subcategories within each category
                    },
                    tags: {
                        type: [String]
                    },
                }
            ]

        }
    ]
});

const AllCategories = mongoose.model('allCategories', allCategoriesSchema);
module.exports = AllCategories;