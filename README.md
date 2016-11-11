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

### Automatic configuration of production environment

+ Production and Staging servers were provisioned automatically as done before.
Code can be found in [InstallAuto](https://github.com/sdomir/DevOps_Milestone3/tree/master/InstallAuto)
+ Redis server was set up using Ansible on another EC2 instance.
+ Initial configuration like git and Docker, was configured using Ansible.
+ We have used Docker to deploy our application to the production environment. All the dependencies to run the application were put inside the docker image such that it can be easily deployed anywhere. 

### Triggering remote deployement

+ We are building our application on localhost in response to a git commit. Once the build succeeds, we create a docker image of our application with all the dependecies. This image is then pushed to the docker hub. All this is automated inside the post-commit hook.
+ We have set up a bare git repository on both the production and staging servers.Using a post-recieve hook, the server will pull the docker image from docker hub and spin up a container that runs our application. All this will be triggered in response to a git push.

## Metrics and alerts

+ AWS provides us with an easy to use dashboard to set up monitoring using CloudWatch alarms, on EC2 instances.
+ We are monitoring two metrics namely
  **CPU Utilization**
  
  **Network load**
+ We have set thresholds for each metric and set up alerts using emails.


## Autoscaling 


## Feature Flags

+ We have used REDIS server to implement Feature flags in our Application. We are using a Ninja app which uses the MVC framework. So in order to add REDIS client into the application, we modified the original application to start a REDIS client. Since, our app is written in Java, we are using the Lettuce Rdis client to create the client. 

+ As per our architecture, we already deployed an Amazon AWS instance and install and run the redis server inside it using Ansible playbook. This Redis server serves as our central database and all the AWS Instances then connect to this server. We are using a completely different EC2 instance to deploy and run the server

[placeholder image for yaml]

+ We will be using a special key in redis called "flag" to turn features on and off. When the flag value is "0", all the new features will be turned off and no one wil have access to them and accessing a new feature will redirect the user to the main page. However, when flag value is "1", all the new features are turned off and a different page is displayed where the new fetaure is implemented

## Flag value is 0




## Flag value is 1




+ We log into the Server running Redis server and open the redis cli. From the CLI, we control the setting of values of the key "flag". As we can saw, all the new features are deployed only if the flag value is set to true.


## Canary releasing

 
