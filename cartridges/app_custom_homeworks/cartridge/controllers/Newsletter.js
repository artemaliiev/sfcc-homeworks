'use strict';

const server = require('server');

/**
 * Newsletter-Start: Subscription form
 * @name Newsletter-Start
 * @function
 * @memberof Newsletter
 */
server.get('Start', server.middleware.https, function (req, res, next) {
    const URLUtils = require('dw/web/URLUtils');
    const actionUrl = URLUtils.url('Newsletter-Handler');
    const newsletterForm = server.forms.getForm('newsletterSubscription');
    newsletterForm.clear();
    res.render('newsletterSubscription/newsletterFormTemplate', {
        actionUrl: actionUrl,
        newsletterForm: newsletterForm
    });
    next();
});

/**
 * Newsletter-Handler: Checking data from form and creting new custom object
 * @name Newsletter-Handler
 * @function
 * @memberof Newsletter
 * @param {httpparameter} - user name and email
 * @param {returns} - json
 */
server.post('Handler', server.middleware.https, function (req, res, next) {
    const Resource = require('dw/web/Resource');

    const newsletterForm = server.forms.getForm('newsletterSubscription');
    const name = newsletterForm.name.value;
    const email = newsletterForm.email.value;

    if (!name || !email) {
        res.json({
            error: true,
            msg: Resource.msg('Invalid Data', '', null)
        });
    } else {
        const isEmailValid = validateEmail(email);

        if (isEmailValid) {
            const URLUtils = require('dw/web/URLUtils');
            const CustomObjectMgr = require('dw/object/CustomObjectMgr');
            const Transaction = require('dw/system/Transaction');

            const UUID = createUUID();
            const emailExist = checkExistingEmail(email);
            if (emailExist) {
                Transaction.wrap(function () {
                    const customObject = CustomObjectMgr.createCustomObject('NewsletterSubscription', UUID);
                    customObject.custom.name = name;
                    customObject.custom.email = email;
                    customObject.custom.status = 'NEW';
                });
                res.json({
                    success: true,
                    redirectUrl: URLUtils.url('Newsletter-Success').toString()
                });
            } else {
                res.json({
                    error: true,
                    msg: Resource.msg(email + ' already exist', '', null)
                });
            }

        } else {
            res.json({
                error: true,
                msg: Resource.msg('Invalid Email', '', null)
            });
        }
    }
    next();
});

/**
 * Newsletter-Success: Rendering success page
 * @name Newsletter-Success
 * @function
 * @memberof Newsletter
 * @param {httpparameter} - user name
 */
server.get('Success', server.middleware.https, function (req, res, next) {
    const name = req.form.name;
    const newsletterForm = server.forms.getForm('newsletterSubscription');
    res.render('newsletterSubscription/newsletterSuccess', {
        newsletterForm: newsletterForm
    });
    next();
});

/**
 * Newsletter-Confirmation: Confirming email and changing custom object
 * @name Newsletter-Confirmation
 * @function
 * @memberof Newsletter
 * @param {httpparameter} - UUID of custom object
 */
server.get('Confirmation', server.middleware.https, function (req, res, next) {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');

    const uuid = req.querystring.uuid;
    const customObject = CustomObjectMgr.getCustomObject('NewsletterSubscription', uuid);

    let message = '';

    if (customObject) {
        if (customObject.custom.status === 'CONFIRMED') {
            res.render('newsletterSubscription/newsletterConfirmationSame', {
                name: customObject.custom.name
            });
        } else if (customObject.custom.status === 'SENT') {
            const Transaction = require('dw/system/Transaction');

            Transaction.wrap(function () {
                customObject.custom.status = 'CONFIRMED';
            });
            res.render('newsletterSubscription/newsletterConfirmationSuccess', {
                name: customObject.custom.name
            });
        }
    } else {
        const URLUtils = require('dw/web/URLUtils');

        const actionUrl = URLUtils.abs('Newsletter-Start').toString();

        res.render('newsletterSubscription/newsletterConfirmationError', {
            actionUrl: actionUrl
        });
    }

    next();
});

function validateEmail(email) {
    const regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

function createUUID() {
    return new Date().getTime().toString();
}

function checkExistingEmail(email) {
    const Transaction = require('dw/system/Transaction');
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');

    const customObject = CustomObjectMgr.queryCustomObject('NewsletterSubscription', "custom.email = {0}", email);

    return customObject ? false : true;
}

module.exports = server.exports();
