# DevOps_Milestone3

##Team Members

1) Rahul Nair (rnair)    
2) Sharat Domir (sdomir)     
3) Swagat Bora (sbora)   

##Introduction

We have used Amazon EC2 to set up remote servers for the deployement pipeline.

**Components**

+ Production Server: Holds the stable version of software
+ Staging Server: Holds the newly staged staged version of software
+ Redis Server: Redis server is run on a seperate instance
+ A java web application that is running inside of a Docker on port 8080

Below is a layout of our setup:

![alt tag](https://github.com/sdomir/DevOps_Milestone3/blob/master/infrastructure.png)

## Tasks

### Triggering remote deployemnet

We are building our application on localhost in response to a git commit. Once the build succeeds, we create a docker image of our application with all the dependecies. This image is then pushed to the docker hub. All this is automated inside the post-commit hook.

We have set up a bare git repository on both the production and staging servers.Using a post-recieve hook, the server will pull the docker image from docker huband spin up a container that runs our application. All this will be triggered in response to a git push.

 
