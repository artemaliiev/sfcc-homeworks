'use strict';

var productBadges = require('./decorators/productBadges');
var originalFullProduct = require('app_storefront_base/cartridge/models/product/fullProduct');

module.exports = function fullProduct(product, apiProduct, options) {
    var locale = options.locale || (typeof request !== 'undefined' && request.locale) || 'default';
    if (locale === 'default') {
        locale = 'en_US';
    }

    var decoratedProduct = originalFullProduct(product, apiProduct, options);
    productBadges(product, apiProduct.attributeModel)
    // colorAvailability(decoratedProduct, options.quantity, apiProduct.minOrderQuantity.value, apiProduct);

    return decoratedProduct;
};