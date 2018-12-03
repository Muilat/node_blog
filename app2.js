const express = require('express');
const path = require("path");

//init app
const app = express();

// set up handlebars view engine
var exphbs = require('express3-handlebars');
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    defaultLayout:'main', 
	helpers: {
		section: function(name, options){
		if(!this._sections) this._sections = {};
		this._sections[name] = options.fn(this);
		return null;
		},
		foo: function () { return 'FOO!'; },
		h1: (content)=>{ return new hbs.handlebars.SafeString("<h1>"+content+"</h1>");}
        },
	extname: '.hbs'},
	);
 
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');




//middleware for static files (css, image)
app.use(express.static(__dirname + '/public'));



// home route
app.get('/', function(req, res){
	res.render('index',{
		pageTitle: "PATROS - HTML5 FREE TEMPLATE",

		helpers: {
            foo: function () { return 'foo.'; }
        }
	})
	// res.send("Hello World");
});


//blog route

//add new blog get
app.get('/add-blog', function(req, res){
	res.render('add-blog', {
		pageTitle: "Add Blog",
		pageId : "add-blog"
	})
})



// custom 404 page
app.use(function(req, res, next){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});
// custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});


// start server on port 8000
app.listen(8000, function(){
	console.log("Server running on port 8000");
})