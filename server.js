// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var body = require("body-parser");

// Scraper Tools
var cheerio = require("cheerio");
var request = require("request");


// Initialize Express
var app = express();

//Database Config
var databaseURL = "scraper";
var collections = ["sccrapedData"];

// Mongojs Config to db Variable
var db= mongojs(databaseURL, collections);
db.on("error", function(error){
    console.log("Database Error:", error);
});

// Main Route
app.get("/", function(req, res){
    res.send("Huffpo Posts");
});

//Retrieve Data from db
app.get("/all", function(req, res){
    db.scrapedData.find({}, function(error, found){
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});


//Scrape Data From Site
app.get("/scrape", function(req, res){
    request("https://huffingtonpost.com/", function(error, response, html){
        var $ = cheerio.load(html);
        $(".title").each(function(i, element){

            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");

            if(title && link) {
                db.scrapedData.insert({
                    title: title,
                    link: link
                },
        
            function(err, inserted){
                if (err) {
                    console.log(err);
                }
                else{
                    console.log(inserted);
                }
            });
        }
    });
});


// Scrape Complete
res.send("Scrape Complete");
});

//Listen on port 3000
app.listen(3000, function(){
   console.log("App running on port 3000")
});