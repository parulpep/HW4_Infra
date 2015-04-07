var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
//var myModule = require('module');
var redis = require('redis')
var args = process.argv.slice(2);
var Blueclient = redis.createClient(6380, '127.0.0.1', {})
//exports.Blueclient = Blueclient;
var list1 = [];
var list2 = [];
//exports.items = items;
var PORT = args[0];
//var Greenclient = myModule.Greenclient;
//var Green_items = myModule.Green_items;


//var Green_items = myModule.Green_items;

//exports.items = items;

// Task 2
// Add hook to make it easier to get all visited URLS.
app.get('/recent', function(req, res, next) 
{
	 //  console.log(req.method, req.url); 
	 // lpush is to store the site urls visited
       Blueclient.lpush('urls',req.url);
	 // ltrim and lrange used below is to contain the number of urls to 5  
	   Blueclient.ltrim('urls', 0, 4);
	  
	   Blueclient.lrange('urls',0, 4, function(err,value){ console.log(value);});
	   Blueclient.lrange('urls',0, 4, function(err,value){ res.send(value);});  // Returning the recent visited urls back to Blueclient
       	   
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
			Blueclient.rpush(['items', img], function(err, value){

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
	    Blueclient.rpoplpush('items', list1, function(err,value){		});
 	//	if (err) throw err
	    Blueclient.lrange(list1,0,0,function(err,value){
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
 
  Blueclient.get("key", function(err,value){ res.send(value) });
 
  Blueclient.lpush('urls',req.url);
 
})

 app.get('/', function(req, res) {
    res.send('blue');
})
// Task 1: /set route
 app.get('/set', function(req,res) {

  Blueclient.lpush('urls',req.url);
  Blueclient.set("key","this message will self-destruct in 10 seconds BLUE SLICE WATCH");
  Blueclient.expire("key",10);    // This will expire the key.
})

 app.get('/switch', function(req, res) {
    //    TARGET = GREEN;
	 //    console.log(req.url);
	//	if(items.length != 0)
	//	Greenclient.lpush('Blueclient', 'grk');	
	//	Green_items.forEach(function (imagedata) 
 	//	res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+temp_Image+"'/>");  
//    }
 //   Blueclient.migrate('127.0.0.1','6379','items','Greenclient');
	res.send('hello switch BLUE');
	
    
})

