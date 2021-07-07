'use strict';

function customPopUp() {
    $('#customPopUpBtn').on('click', function () {
        $('#customPopUp').modal('show');
    })
}

module.exports = {
    customPopUp: customPopUp
};