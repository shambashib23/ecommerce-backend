const express = require("express");
const jwt = require('jsonwebtoken');

const router = express.Router();

const cookieParser = require('cookie-parser');

router.use(cookieParser());
const generateToken = require('../utils/generateToken.js');
const AllCategories = require('../models/allCategoriesSchema.js');


// Upload All categories
router.post('/upload-categories', async (req, res) => {
    try {
        const {
            title,
            subcategories
        } = req.body;
        console.log(req.body);

        if (!title) {
            return res.status(422).json(
                {
                    message: "Upload all details correctly !",
                    status: 404
                });
        }
        // check if category title is unique
        const existingCategory = await AllCategories.findOne({ "categories.title": title });

        if (existingCategory) {
            return res.status(422).json(
                {
                    message: "Category already exists!",
                    status: 422,
                    success: false
                });
        }

        if (subcategories) {
            const subcategoryTitles = subcategories.map(subcat => subcat.title);
            const existingSubcategories = await AllCategories.findOne({
                "categories.subcategories.title":
                {
                    $in: subcategoryTitles
                }
            });

            if (existingSubcategories) {
                const existingTitles = existingSubcategories.categories
                    .flatMap(cat => cat.subcategories)
                    .map(subcat => subcat.title);
                const duplicateTitles = subcategoryTitles.filter(title => existingTitles.includes(title));
                return res.status(422).json({
                    message: `The following subcategories already exist: ${duplicateTitles}`,
                    status: 422,
                    success: false
                });
            }
        }

        // create new category with subcategories
        const newCategory = await AllCategories.create({
            categories: {
                title: title,
                subcategories: subcategories || []
            }
        });
        return res.status(200).json({
            message: "Category created successfully",
            status: 200,
            success: true,
            categories: newCategory.categories
        });
    } catch (e) {
        return res.status(500).json(
            {
                message: `Server error --> ${e}`,
                status: 500,
                success: false
            }
        );
    }
})

// getting the list of all categories
router.get("/get-all-categories", async (req, res) => {
    try {
        const categories = await AllCategories.find({});

        if (categories.length === 0) {
            return res.status(404).json(
                {
                    message: "No Categories Found !",
                    status: 404,
                    success: false,
                })
        }

        let simplifiedCategories = categories.map(category => category.categories)
        if (!simplifiedCategories) {
            return res.status(404).json(
                {
                    message: "No Simplified Categories Found !",
                    status: 404,
                    success: false,
                })
        }
        // For sorting categories alphabetically
        simplifiedCategories = simplifiedCategories.sort();

        return res.status(200).json({
            message: `Categories found and alphabetically sorted!`,
            status: 200,
            success: true,
            categories: simplifiedCategories
        });


    } catch (e) {

    }
})

// Deleting categories by title!
router.delete('/delete-categories/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const existingCategory = await AllCategories.findOneAndDelete({ "categories.title": title });
        if (!existingCategory) {
            return res.status(404).json({
                message: `Category with title ${title} not found`,
                status: 404,
                success: false
            });
        } else {
            return res.status(200).json({
                message: `Category with title ${title} deleted successfully!`,
                status: 200,
                success: true
            });
        }

    } catch (e) {
        return res.status(500).json({
            message: `Error deleting category: ${e.message}`,
            status: 500,
            success: true
        });

    }
})

const auth = require("../middlewares/auth.js");

module.exports = router;