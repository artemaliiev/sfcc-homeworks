'use strict';

/**
 *
 * @param {*} args
 * @returns
 */

function sendEmailSubscription() {
    const Status = require('dw/system/Status');
    const Logger = require('dw/system/Logger').getLogger('Learn', 'learn');
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const hooksHelper = require('*/cartridge/scripts/helpers/hooks');

    const customObjects = CustomObjectMgr.queryCustomObjects(
        "NewsletterSubscription",
        "custom.status = 'NEW'",
        "custom.UUID asc",
        ""
    );

    while (customObjects.hasNext()) {
        const customUser = customObjects.next();

        hookData = dw.system.HookMgr.callHook('dw.newsletter.subscription', 'sendMail', [{
            email: customUser.custom.email,
            name: customUser.custom.name,
            uuid: customUser.custom.UUID
        }]);

    }

    return new Status(Status.OK, 'OK', '');
}

module.exports = {
    sendEmailSubscription: sendEmailSubscription
};
