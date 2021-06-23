'use strict';

var badges = require('./decorators/badges');
var originalFullProduct = require('app_storefront_base/cartridge/models/product/fullProduct');

module.exports = function fullProduct(product, apiProduct, options) {
    var locale = options.locale || (typeof request !== 'undefined' && request.locale) || 'default';
    if (locale === 'default') {
        locale = 'en_US';
    }

    var decoratedProduct = originalFullProduct(product, apiProduct, options);
    badges(product, apiProduct);

    return decoratedProduct;
};