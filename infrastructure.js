var url = require('url');
var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
var redis = require("redis");
var GREEN = 'http://127.0.0.1:5060';
var BLUE  = 'http://127.0.0.1:9090';
var Greenclient = redis.createClient(6379, '127.0.0.1', {})
var Blueclient = redis.createClient(6380, '127.0.0.1', {})
var myModule = require('module');
var items = myModule.items;
mirror_flag = true;
TARGET = BLUE;
var replyA = [];
var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res)
    {  
	
     var pathname = url.parse(req.url).pathname;
	  if((pathname == "/switch" && TARGET == GREEN) || (mirror_flag == true && TARGET == GREEN))
{
Greenclient.lrange('items1',0,-1, function(err, reply){
//	res.send(reply.length);
replyA = reply;
for(var count=0; count < replyA.length; count++)
{
Blueclient.lpush('items',replyA[count], function(err,reply){
});	
}
});
TARGET = BLUE;
}
else if((pathname == "/switch" && TARGET == BLUE) || (mirror_flag == true && TARGET == BLUE))
{
Blueclient.lrange('items',0,-1, function(err, reply){
//	res.send(reply.length);
replyA = reply;
for(var count=0; count < replyA.length; count++)
{
Greenclient.lpush('items1',replyA[count], function(err,reply){
});	
}
});
TARGET = GREEN;
}
      proxy.web( req, res, {target: TARGET } );
    });
    server.listen(8000);

	// Launch blue slice
    exec('C:/Users/parulpep/Documents/GitHub/Deployment/node_modules/.bin/forever -w --watchDirectory=deploy/blue-www start deploy/blue-www/main.js 9090');
    console.log("blue slice");

    // Launch green slice
    exec('C:/Users/parulpep/Documents/GitHub/Deployment/node_modules/.bin/forever -w --watchDirectory=deploy/green-www start deploy/green-www/main.js 5060');
    console.log("green slice");

//setTimeout
//var options = 
//{
//  url: "http://localhost:8080",
//};
//request(options, function (error, res, body) {

  },

  teardown: function()
  {
   exec('forever stopall', function()
   {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}


infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.log(err);
  infrastructure.teardown();
  } );