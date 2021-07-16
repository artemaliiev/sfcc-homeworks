/**
 * A simple form controller.
 *
 */
'use strict';
const server = require('server');

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

            // checkExistingEmail(email);

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
                msg: Resource.msg('Invalid Email', '', null)
            });
        }
    }
    next();
});

server.get('Success', server.middleware.https, function (req, res, next) {
    const name = req.form.name;
    const newsletterForm = server.forms.getForm('newsletterSubscription');
    res.render('newsletterSubscription/newsletterSuccess', {
        newsletterForm: newsletterForm
    });
    next();
});

function validateEmail(email) {
    const regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

function createUUID() {
    return new Date().getTime().toString();
}

// function checkExistingEmail(email) {
//     const Transaction = require('dw/system/Transaction');
//     const customObjectMgr = require('dw/object/CustomObjectMgr');

//     Transaction.wrap(function () {
//         const customObject = customObjectMgr.queryCustomObject('NewsletterSubscription', 'email = emaildfd@asd.asd');
//         const customObjects = customObjectMgr.getAllCustomObjects('NewsletterSubscription');
//         // const customObject = customObjectMgr.queryCustomObject('NewsletterSubscription', email);
//         // customObjects.map(optionModel.options, function (option) {

//         // })
//         return customObject;
//     });
// }

module.exports = server.exports();
