'use strict';

const originalProductHelpers = require('app_storefront_base/cartridge/scripts/helpers/productHelpers');

/**
 *
 * @param {*} products individual products of product set
 * @returns first images of individual product
 */
function productSetSlider(products) {
    const images = {};
    images.large = [];
    images.small = [];

    products.map(function (product) {
        images['large'].push(product.images.large[0]);
        images['small'].push(product.images.small[0]);
    });

    return images;
}

module.exports = Object.assign(originalProductHelpers, { productSetSlider: productSetSlider });
