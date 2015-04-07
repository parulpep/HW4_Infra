var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var redis = require('redis')
var args = process.argv.slice(2);
//var myModule = require('module');
var Greenclient = redis.createClient(6379, '127.0.0.1', {})
var PORT = args[0];
var list1 = [];
var list2 = [];

//var Blueclient = myModule.Blueclient;

//exports.Greenclient = Greenclient;
//var Blue_items1 = myModule.Blueclient;
//exports.items1 = items1;


// Task 2
// Add hook to make it easier to get all visited URLS.
app.get('/recent', function(req, res, next) 
{
	 //  console.log(req.method, req.url); 
	 // lpush is to store the site urls visited
       Greenclient.lpush('urls',req.url);
	 // ltrim and lrange used below is to contain the number of urls to 5  
	   Greenclient.ltrim('urls', 0, 4);
	  
	   Greenclient.lrange('urls',0, 4, function(err,value){ console.log(value);});
	   Greenclient.lrange('urls',0, 4, function(err,value){ res.send(value);});  // Returning the recent visited urls back to Greenclient
       	   
	  // next(); // Passing the request to the next handler in the stack.   
	        
});

// Task 3


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files
    
    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
			Greenclient.rpush(['items1', img], function(err, value){

	  		});
			                     // On upload, the images are put in the queue list items
 	  	//	console.log(img);
 		});
 	}
   res.status(204).end()
 }]);
 
 
 // Task 3
// Function that displays the uploaded pics.
app.get('/meow', function(req, res) {
 	{
	    Greenclient.rpoplpush('items1', list1, function(err,value){		});
 	//	if (err) throw err
	    Greenclient.lrange(list1,0,0,function(err,value){
			list2 = value;
		});
 		res.writeHead(200, {'content-type':'text/html'});
 		list2.forEach(function (imagedata) 
 		{
    		temp_Image = imagedata;                  
		//	console.log(imagedata);          
 		});
		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+temp_Image+"'/>");     // For displaying the most recent image to the Greenclient
		//items1.pop();       // For deleting the recently displayed image
    	res.end();
 	}
 })
 

// HTTP SERVER
 var server = app.listen(PORT, function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })
 
 // HTTP SERVER
 // Task 4
 // Running another instance on different port (number 3001)

 
 // Task 1: /get route
 app.get('/get', function(req, res) {

  Greenclient.get("key", function(err,value){ res.send(value) });
 
  Greenclient.lpush('urls',req.url);
 
})
// Task 1: /set route
 app.get('/set', function(req,res) {

  Greenclient.lpush('urls',req.url);
  Greenclient.set("key","this message will self-destruct in 10 seconds GREEN SLICE");
  Greenclient.expire("key",10);    // This will expire the key.
})

 app.get('/switch', function(req, res) {
 
     res.send("hello switch green");
})
