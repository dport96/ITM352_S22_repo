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
    var errors = {};

    var q = request.body['qty_textbox1'];
    // invalaid if q is not a quanity
    if (!isNonNegInt(q)) {
       errors['qantity'] = isNonNegInt(q, true);
    } 
    // check is some items were selected
    if(q == 0) {
        errors['no_qanitity'] = `You need to select some things`;
    }

    if( Object.keys(errors).length == 0 ) {
        response.send(`Thank you for purchasing ${q} things!`);
    } else {
        response.redirect('./order_page.html?errors=' + JSON.stringify(errors) );
    }
});


app.use(express.static(__dirname + '/public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback


function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    }

    return (returnErrors ? errors : (errors.length == 0));
}
