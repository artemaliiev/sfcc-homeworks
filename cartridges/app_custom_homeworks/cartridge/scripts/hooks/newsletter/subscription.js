'use strict';

/**
 * Send email with content
 * @param {Object} emailObj - email data, such: receiver, sender, subject
 * @returns {dw.system.status} results of sending email
 */

function sendMail(emailObj) {
    const HashMap = require('dw/util/HashMap');
    const Mail = require('dw/net/Mail');
    const Template = require('dw/util/Template');
    const URLUtils = require('dw/web/URLUtils');

    const submitionUrl = URLUtils.abs('Newsletter-Confirmation', 'uuid', emailObj.uuid).toString();
    const context = new HashMap();
    context.put('name', emailObj.name);
    context.put('submitionUrl', submitionUrl);

    const template = new Template('newsletterSubscription/subscriptionEmailTemplate');
    const mail = new Mail();
    const mailBody = template.render(context).text;

    mail.addTo(emailObj.email);
    mail.setFrom(emailObj.from);
    mail.setSubject(emailObj.subject);
    mail.setContent(mailBody);

    return mail.send();
}

module.exports = {
    sendMail: sendMail
};
