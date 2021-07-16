'use strict';

function sendMail(user) {
    const HashMap = require('dw/util/HashMap');
    const Mail = require('dw/net/Mail');
    const Template = require('dw/util/Template');

    const context = new HashMap();
    context.put('name', user.name);

    const template = new Template('newsletterSubscription/subscriptionEmailTemplate');

    const mail = new Mail();
    const mailBody = template.render(context).text;

    mail.addTo("glepromotion@gmail.com");
    mail.setFrom("test@test.com");
    mail.setSubject("Example Email");
    mail.setContent(mailBody);

    return mail.send();
}

module.exports = {
    sendMail: sendMail
};
