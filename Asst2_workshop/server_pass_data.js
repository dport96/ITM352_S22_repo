var express = require('express');
var app = express();

app.use(express.urlencoded({extended:true}));

var product_data = {quantity_avail: 10};

var quantity_stored;

var users_reg_data = 
{
"dport": {"password": "portpass"},
"kazman": {"password": "kazpass"}
};

app.get("/invoice", function (request, response) {
    // Give a simple invoice using query string data
    let params = new URLSearchParams(request.query);
    if(!params.has('username')) {
        response.redirect('./login?'+ params.toString());
        return;
    }
    response.send(`Thank you ${params.get('username')}. You want ${request.query['quantity']} items`);
    });

app.get("/select_quantity", function (request, response) {

    // Give a simple quantity form
    str = `
    <body>
    There are ${product_data.quantity_avail} products available.<br>
    <form action="" method="POST">
    <input type="text" name="quantity" size="40" placeholder="enter quantity desired" ><br />
    <input type="submit" value="Submit" id="submit">
    </form>
    </body>
        `;
    response.send(str);
    });

app.post("/select_quantity", function (request, response) {

    // Redirect to login page with form data in query string
    quantity_stored = request.body;
    response.redirect('./login');
});

app.get("/login", function (request, response) {

// Give a simple login form
str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
response.send(str);
});

app.post("/login", function (request, response) {
    let params = new URLSearchParams(quantity_stored);
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    the_username = request.body['username'].toLowerCase();
    the_password = request.body['password'];
    if (typeof users_reg_data[the_username] != 'undefined') {
        if (users_reg_data[the_username].password == the_password) {
                // goood quantity, so remove from inventory
            product_data.quantity_avail -= Number(params.get('quantity'));
            params.append('username', the_password);
            response.redirect('./invoice?'+ params.toString());
        } else {
            response.send(`Wrong password!`);
        }
        return;
    }
    response.send(`${the_username} does not exist`);
});

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });