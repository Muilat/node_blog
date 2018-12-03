const express = require('express');
const path = require("path");

//init app
const app = express();

const blocks = {};

// set up handlebars view engine
var hbs = require('hbs');
var hbsutils = require('hbs-utils');

const templateUtil = hbsutils(hbs);



templateUtil.registerPartials('${__dirname}/views/partials');
templateUtil.registerWatchedPartials('${__dirname}/views/partials');
templateUtil.precompilePartials('${__dirname}/views/partials');
//register helper
hbs.registerHelper({
	eq: (val1, val2) => { return val1 === val2; },
	h1: (content)=>{ return new hbs.handlebars.SafeString("<h1>"+content+"</h1>");}
});
//register partials
hbs.registerPartials(__dirname + '/views/partials');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.engine('hbs',hbs_template.__express);


//middleware for static files (css, image)
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('block', function(name){
	const val = (blocks[name]||[]).join('\n');

	//clear block
	blocks[name] = [];
	return val;
});

hbs.registerHelper('extend', function(name, context){
	let block = blocks[name];

	if(!block){
		block = blocks[name] = [];
	}

	block.push(context.fn(this));
});

hbs.registerHelper('section', function(name, options){
		if(!this._sections) this._sections = {};
		this._sections[name] = options.fn(this);
		return null;
		
});


// home route
app.get('/', function(req, res){
	res.render('index',{
		
        pageTitle: "PATROS - HTML5 FREE TEMPLATE"
	})
	// res.send("Hello World");
});

// /blog route

//add new blog get
app.get('/add-blog', function(req, res){
	res.render('add-blog', {
		pageTitle: "Add Blog",
		pageId : "add-blog"
	})
})

// blog 
app.get('/blog', function(req, res){
	res.render('blog', {
		pageTitle: "Blog",
		pageId : "blog"
	})
})



// custom 404 page
app.use(function(req, res){
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