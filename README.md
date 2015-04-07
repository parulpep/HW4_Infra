Assignment 3
============

### Setup

* Clone Deployment and follow the steps given in workshop.
* Run `npm install`.
* Install redis
* In C:\Program Files\Redis\conf create a configuration file redis-s1-conf and change the port, logfile,dir and pidfile (my port number is 6380).
* Now run from command line both the servers by using the commands
   redis-server conf\redis-s1.conf for server
   redis-cli -h 127.0.0.1 -p 6380 fpor client
   
   Similarly do for port number 6379.
   
   this will run both the instances
   
* The deployed HW3 file has main.js has the code for routes /get, /set, /upload, /meow and /recent. I have included just a route for /switch in there.

## Task 1: Complete git/hook setup

* Create post-receive file in blue.git/hooks and green.git/hooks and include the following in it.
        
		#!/bin/sh
		#
		# An example hook script for the "post-receive" event.
		#
		# The "post-receive" script is run after receive-pack has accepted a pack
		# and the repository has been updated.  It is passed arguments in through
		# stdin in the form
		#  <oldrev> <newrev> <refname>
		# For example:
		#  aa453216d1b3e49e7f6f98441fa56946ddcd6a20 68f7abf4e6f922807889f52bc043ecd31b79f814 refs/heads/master
		#
		# see contrib/hooks/ for a sample, or uncomment the next line and
		# rename the file to "post-receive".

		#. /usr/share/doc/git-core/contrib/hooks/post-receive-email

		GIT_WORK_TREE=C:/Users/parulpep/Documents/GitHub/Deployment/deploy/blue-www/ git checkout -f

		export GIT_WORKING_DIR=C:/Users/parulpep/Documents/GitHub/Deployment/deploy/blue-www/

		cd "$GIT_WORKING_DIR"
		npm install

Provide permissions using 'chmod +x post-receive'



* Also in Deployment folder, in infrastructure.js, include '-w --watchDirectory=deploy/blue-www' in the 'exec' line. This will deploy the changes in the file and no need to restart the server.
![/exec_watch](https://github.com/parulpep/HW4_Infra/blob/master/exec_watch.PNG)

* Run the server using 'node_modules\.bin\forever start infrastructure.js' from your deployment folder from command line. The server is listening at port 8000.
![/running_server](https://github.com/parulpep/HW4_Infra/blob/master/running_server.PNG)

## Task 2: Create blue/green infrastructure

* Deploy Hw4_App present at https://github.com/parulpep/Hw4_App
  steps given in Deployment workshop. We will get the app in our
  blue-www and green-www.

* I ran two redis instances at 6380 and 6379 for green-www and blue-www respectively.
![/redis_instances](https://github.com/parulpep/HW4_Infra/blob/master/redis_instances.PNG)

* Change TARGET = GREEN to TARGET = BLUE in infrastructure.js
* Output: 
![/target_blue](https://github.com/parulpep/HW4_Infra/blob/master/target_blue.PNG)



## Task 3 and 4: Demonstrate /switch and migration

* While the server is listening at localhost:8000, it transfers the request to blue-www main.js which is running at 6380 redis instance. We can run all the routes of main.js
  here. I have a route called switch in main.js. I uploaded image using 'Curl -F "img=@./img/morning.jpg" localhost:9090/upload to blue instance.
  If I do "localhost:8000/switch", it will switch to green and upload the image morning.jpg to redis instance of green-www, i.e., 6379.
  
  So, we can see here that both the functionalities of watch and data migration is taking place

## Task 5: Mirroring

* I have included a flag in infrastructure.js that when true migrates the file from 
  one instance to another.
* Go to localhost:8000 and upload pic at 9090 (blue instance). On checking both the instances. One can find the images.

  
## References

* http://ebeid-soliman.blogspot.com/2013/07/running-multiple-redis-instances-on.html
