'use strict';

const Status = require('dw/system/Status');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');
const Transaction = require('dw/system/Transaction');
const Logger = require('dw/system/Logger').getLogger('Learn', 'learn');

/**
 * sendEmailSubscription
 * @returns {dw.system.status} results of job work
 */

function sendEmailSubscription() {
    const hooksHelper = require('*/cartridge/scripts/helpers/hooks');

    const subscriptionEmailSubject = dw.system.Site.current.preferences.custom.subscriptionEmailSubject;
    const subscriptionEmailFrom = dw.system.Site.current.preferences.custom.subscriptionEmailFrom;

    const customObjects = CustomObjectMgr.queryCustomObjects(
        "NewsletterSubscription",
        "custom.status = 'NEW'",
        "custom.UUID asc",
        ""
    );

    while (customObjects.hasNext()) {
        const customUser = customObjects.next();

        try {
            const emailData = dw.system.HookMgr.callHook('dw.newsletter.subscription', 'sendMail', [{
                email: customUser.custom.email,
                name: customUser.custom.name,
                uuid: customUser.custom.UUID,
                from: subscriptionEmailFrom,
                subject: subscriptionEmailSubject
            }]);

            try {
                Transaction.wrap(function () {
                    customUser.custom.status = 'SENT';
                });
                Logger.info('Email sent to user '+customUser.custom.email+', '+customUser.custom.UUID);
            } catch (err) {
                Logger.error('Email sent to user '+customUser.custom.email+', '+customUser.custom.UUID+', but the status has not been changed. '+err);
            }
        } catch (e) {
            Logger.error('Failed to send email to user '+customUser.custom.email+', '+customUser.custom.UUID+'. '+e);
        }
    }

    customObjects.close();

    return new Status(Status.OK, 'OK');
}

/**
 * Removing custom objects when status = CONFIRMED
 * @returns {dw.system.status} results of job work
 */
function removeCustomObjectSubscription() {
    const customObjects = CustomObjectMgr.queryCustomObjects(
        "NewsletterSubscription",
        "custom.status = 'CONFIRMED'",
        "custom.UUID asc",
        ""
    );

    while (customObjects.hasNext()) {
        const customObject = customObjects.next();

        try {
            Transaction.wrap(function () {
                CustomObjectMgr.remove(customObject);
            });
            Logger.error('Custom object with uiid: '+customObject.custom.UUID+' removed');
        } catch (err) {
            Logger.error(err);
        }
    }

    customObjects.close();

    return new Status(Status.OK, 'OK', 'asdsa');
}

module.exports = {
    sendEmailSubscription: sendEmailSubscription,
    removeCustomObjectSubscription: removeCustomObjectSubscription
};
