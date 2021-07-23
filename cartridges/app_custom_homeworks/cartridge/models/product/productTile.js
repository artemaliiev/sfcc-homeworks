'use strict';
const badges = require('./decorators/badges');
const originalProductTile = require('app_storefront_base/cartridge/models/product/productTile');

module.exports = function productTile(product, apiProduct, productType) {
    const decoratedProductTile = originalProductTile(product, apiProduct, productType);

    badges(product, apiProduct);

    return decoratedProductTile;
};
