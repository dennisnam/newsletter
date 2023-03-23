const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); 


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const e = req.body.email;

    const data = {
        members: [
            {
                email_address: e,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/ed2f482848";
    const options = {
        method: "POST",
        auth: "dennisNam:b8df0c9c5fc805a59d720d884ab4d1ff-us21"
    };


    const request = https.request(url, options, function(response){

        // if (response.statusCode === 200) {
        //     res.sendFile(__dirname + "/success.html");
        // } else {
        //     res.sendFile(__dirname + "/failure.html");
        // }

        response.on("data", function(data){

            const mailchimpData = JSON.parse(data);
            const errorCode = mailchimpData.error_count;
            
            if (errorCode === 1) {
                res.sendFile(__dirname + "/failure.html");
            } else {
                res.sendFile(__dirname + "/success.html");
            }
        });
        
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000...");
});

// mail chimp API key
// b8df0c9c5fc805a59d720d884ab4d1ff-us21

// audience id
// ed2f482848.