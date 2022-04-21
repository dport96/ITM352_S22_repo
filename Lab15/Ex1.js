
var filename = "./user_data.json";

const fs = require("fs");

if(fs.existsSync(filename)) {
    let stats = fs.statSync(filename);
    console.log(`${filename} has ${stats.size} characters`);
    var data = fs.readFileSync(filename, 'utf-8');
    var users = JSON.parse(data);
    if(typeof users["kazman"] != 'undefined') {
        console.log(users["kazman"].password);
    }
} else {
    console.log(`${filename} does not exist!`);
}

var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

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
    console.log(request.body);
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    if(typeof users[request.body.username] != 'undefined') {
        // username exists, so get the stored password and check if it matches password entered
        if(users[request.body.username].password == request.body.password) {
            response.send(`${request.body.username} is logged in!`);
            return;
        } else {
            response.send(`Password does not match saved password<br>${str}`);
        }

    } else {
        response.send(`${request.body.username} does not exist<br>${str}`);
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

 app.post("/register", function (request, response) {
    // process a simple register form
    console.log(request.body);
    let username = request.body.username;
    users[username] = {};
    users[username].password = request.body.password;
    users[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users));
 });

 app.get("/set_cookie", function (request, response) {
    var myname = "Dan Port";
    response.cookie('users_name', myname);
    response.send(`cookie sent for ${myname}`);
 });

 app.get("/get_cookie", function (request, response) {
    console.log(request.cookies);
    response.send(`Welcome to the Use Cookie page ${request.cookies['users_name']}`);
 });



app.listen(8080, () => console.log(`listening on port 8080`));