const express = require("express");
const router = express.Router();

const ProductDetails = require('../models/productDetailsSchema.js');

// Posting Product Details
router.post('/upload-products', async (req, res) => {
    try {
        const {
            productImage,
            productName,
            productDetails,
            userReviews
        } = req.body;
        console.log(req.body);

        if (!productName || !productImage || !productDetails || !userReviews) {
            return res.status(422).json(
                {
                    message: "Upload all product details correctly !",
                    status: 422,
                    success: false
                }
            );
        }

        const options = { timeout: 20000000 };


        const newProduct = await ProductDetails.create(
            {
                products:
                {
                    productImage: productImage,
                    productName: productName,
                    productDetails: productDetails,
                    userReviews: userReviews,
                }

            }
        );

        return res.status(200).json(
            {
                message: "Product created successfully",
                status: 200,
                success: true,
                products: newProduct.products
            }
        );
    } catch (e) {
        if (e.code === 11000 && e.message.includes('productName')) {
            return res.status(422).json({
                message: "Product already exists!",
                status: 422,
                success: false
            });
        }
        return res.status(500).json(
            {
                message: `Server error --> ${e}`,
                status: 500
            }
        );
    }
})


// Displaying All products
router.get('/product-details', async (req, res) => {
    try {
        const products = await ProductDetails.find({}).sort(
            {
                "products.productName": 1
            }
        );

        if (products.length === 0) {
            return res.status(404).json(
                {
                    message: "No Products found!",
                    status: 404,
                    success: false,
                })
        }

        let simplifiedProducts = products.map(product => ({
            productId: product._id,
            ...product.products,
        })
        );

        if (simplifiedProducts.length === 0) {
            return res.status(404).json(
                {
                    message: "No Simplified Products Found!",
                    status: 404,
                    success: false,
                })
        }

        return res.status(200).json({
            message: 'Products found and alphabetically sorted!',
            status: 200,
            products: simplifiedProducts
        });
    } catch (e) {
        return res.status(500).json({
            message: `Server error --> ${e}`,
            status: 500,
        })
    }

})




module.exports = router;