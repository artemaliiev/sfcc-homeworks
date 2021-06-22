'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
 * Creates an object of the visible badges for a product
 * @param {dw.catalog.ProductAttributeModel} attributeModel - attributeModel for a given product.
 * @return {Object|null} an object containing the visible badges for a product.
 */
function getbadges(attributeModel) {
    var badges;
    // out.print( JSON.stringify(attributeModel) );
    return attributeModel;
    var visibleAttributeGroups = attributeModel.visibleAttributeGroups;

    if (visibleAttributeGroups.getLength() > 0) {
        badges = collections.map(attributeModel, function (group) {
            var visibleAttributeDef = attributeModel.getVisibleAttributeDefinitions(group);
            var attributeResult = {};
            if(group.ID === 'storefrontAttributes') {
                return
            }

            attributeResult.ID = group.ID;
            attributeResult.name = group.displayName;
            attributeResult.badges = collections.map(
                visibleAttributeDef,
                function (definition) {
                    var definitionResult = {};
                    definitionResult.label = definition.displayName;

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
            );

            return attributeResult;
        });
    } else {
        badges = null;
    }

    return badges;
}

module.exports = function (object, attributeModel) {
    Object.defineProperty(object, 'badges', {
        enumerable: true,
        value: getbadges(attributeModel)
    });
};
