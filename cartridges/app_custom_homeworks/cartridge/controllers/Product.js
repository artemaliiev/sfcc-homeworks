'use strict';

const server = require('server');
const page = module.superModule;

server.extend(page);

server.append('Show', function (req, res, next) {
    const viewData = res.getViewData();

    if (viewData.product.productType === 'set') {
        const productHelper = require('*/cartridge/scripts/helpers/productHelpers');

        viewData.product.setSlides = productHelper.productSetSlider(viewData.product.individualProducts);
    }

    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
