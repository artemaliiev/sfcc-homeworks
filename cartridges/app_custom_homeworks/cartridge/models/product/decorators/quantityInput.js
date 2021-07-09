'use strict';

var URLUtils = require('dw/web/URLUtils');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');

/**
 * Compile quantity meta for input
 *
 * @param {string} selectedQty - Quanity selected
 * @param {string} pid - Product ID
 * @param {Object} attributes - Variation attribute query params
 * @param {ProductOptions[]} options - Product options query params
 * @return {Object} - Quantity data for PDP input
 */
function getQuantities(selectedQty, pid, attributes, options) {
    var quantity = {};
    var endpoint = 'Product-Variation';
    var baseUrl = URLUtils.url(endpoint, 'pid', pid).relative().toString();
    var params = {
        options: options || [],
        variables: attributes || {}
    };
    const url = urlHelper.appendQueryParams(baseUrl, params);
    quantity.value = selectedQty.toString();
    quantity.url = url;

    return quantity;
}

module.exports = function (object, stepQuantity, attributes, options) {
    Object.defineProperty(object, 'quantityInput', {
        enumerable: true,
        value: getQuantities(object.selectedQuantity, object.id, attributes, options)
    });
};
