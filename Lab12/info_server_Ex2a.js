var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));

// respond to any req for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});


app.get('/test', function (request, response, next) {
    response.send('in test: ' + request.method + ' to path ' + request.path);
});

app.post('/process_form', function (request, response, next) {
    var q = request.body['qty_textbox1'];
    if (typeof q != 'undefined') {
    response.send(`Thank you for purchasing ${q} things!`);
    } else {
        response.send(`Nothing selected`);
    }
});


app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback