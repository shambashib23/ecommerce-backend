const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema({
    products: {
        productImage:
            [
                {
                    type: String,
                    required: true
                }
            ],
        productName: {
            type: String,
            required: true,
            unique: true
        },
        productDetails: {
            type: String,
            required: true
        },
        userReviews: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

    }
});

// Indexing the schema
productDetailsSchema.index({ productName: 1, productDetails: 1 });

const ProductDetails = mongoose.model('productDetails', productDetailsSchema);

module.exports = ProductDetails;