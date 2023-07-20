// //jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const env = require('dotenv').config();


const app = express();

const PORT = process.env.PORT | 3000;

app.use(express.static("public")); //Used to access the contents of public folder

//Use Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email_id = req.body.email_id;

    const data = {
        members: [{
            email_address: email_id,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/0b2e65decc" //use server number included in api key in place of 21
    const options = {
        method: "POST",
        auth: "sam28:" + process.env.API_KEY

        //If using .env file use: "random username" + process.env.API_KEY
    }

    const mailChimpRequest = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            // res.send("<h1>You Have Successfully Subscribed To Our Newsletter!</h1>");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("<h1>Error Signing Up! Please Try Again</h1>");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    mailChimpRequest.on("error", function(error) {
        console.log(error);
    });

    mailChimpRequest.write(jsonData);
    mailChimpRequest.end();



    // console.log(firstName, lastName, email);
});


app.post("/failure", function(req, res) {
    res.redirect("/");
})


app.listen(PORT, function() { //process.env.PORT--- this port is dynamic used to acess the port assigned by hosted web server
    console.log("Server Started On Port 3000"); //3000 port for local server i.e. this pc
});