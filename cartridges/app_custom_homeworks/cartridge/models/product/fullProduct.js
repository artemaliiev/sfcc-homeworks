'use strict';

var badges = require('./decorators/badges');
var quantityInput = require('./decorators/quantityInput');
var originalFullProduct = require('app_storefront_base/cartridge/models/product/fullProduct');

module.exports = function fullProduct(product, apiProduct, options) {
    var locale = options.locale || (typeof request !== 'undefined' && request.locale) || 'default';
    if (locale === 'default') {
        locale = 'en_US';
    }

    var decoratedProduct = originalFullProduct(product, apiProduct, options);
    badges(product, apiProduct);
    quantityInput(product, apiProduct.stepQuantity.value, options.variables, options.options)

    return decoratedProduct;
};