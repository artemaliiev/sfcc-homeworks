'use strict';

var formValidation = require('../components/formValidation');

module.exports = {
    newsletter: function () {
        $('form.newsletter-form').submit(function (e) {
            const newsletterForm = $(this);
            e.preventDefault();
            const url = newsletterForm.attr('action');
            // newsletterForm.spinner().start();
            $('form.newsletter-form').trigger('newsletter:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: newsletterForm.serialize(),
                success: function (data) {
                    newsletterForm.spinner().stop();
                    if (!data.success) {
                        alert(data.msg);
                    } else {
                        location.href = data.redirectUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    // newsletterForm.spinner().stop();
                }
            });
            return false;
        });
    }
};
