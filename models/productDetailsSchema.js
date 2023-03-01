const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema({
    productImage: {
        type: String,
    },
    productName: {
        type: String,
        required: true
    },
    productDetails: {
        type: String,
    },
    userReviews: {
        type: Number,
        min: 1,
        max: 5,
    },
});

// Indexing the schema
productDetailsSchema.index({ productName: 1, productDetails: 1 });

const ProductDetails = mongoose.model('productDetails', productDetailsSchema);

module.exports = ProductDetails;