'use strict';

/**
 *
 * @param {*} apiProduct
 * @returns
 */
function getBadges(attributeModel) {
    const definition = attributeModel.getAttributeDefinition('productBadges');
    let definitionResult = {};
    if (definition.multiValueType) {
        definitionResult.value = attributeModel.getDisplayValue(definition).map(
            function (item) {
                return item;
            });
    } else {
        definitionResult.value = [attributeModel.getDisplayValue(definition)];
    }

    return definitionResult;
}

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'badges', {
        enumerable: true,
        value: getBadges(apiProduct.attributeModel)
    });
};
