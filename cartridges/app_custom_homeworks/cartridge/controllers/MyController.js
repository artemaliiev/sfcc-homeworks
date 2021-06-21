var server = require('server');

server.get('Show', function (req, res, next) {
    res.render('home/myTestTemplate.isml');
    next();
});


server.get('ShowAnotherMessage', function (req, res, next) {
    res.render('home/anotherMessage.isml');
    next();
});

module.exports = server.exports();