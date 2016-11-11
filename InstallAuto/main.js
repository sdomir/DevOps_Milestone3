var needle = require("needle");
  var os   = require("os");
  var AWS = require('aws-sdk');
  var fs = require('fs')
  var exec = require('child_process').exec;
  var config = require('./config.json') 

  AWS.config.update({accessKeyId:config.aws_accesskey, 
    secretAccessKey:config.aws_secretkey});

  AWS.config.update({region: config.aws_region});

  var ip_addresses = {"aws_ec2": [], "digital_ocean": []}

  var headers =
  {
    'Content-Type':'application/json',
    Authorization: 'Bearer ' + config.digi_token
  };

  var ec2Params = {
    ImageId: 'ami-e1906781',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    KeyName: config.aws_keyname
  }

  var ec2 = new AWS.EC2();

  var response_body;

  function createEC2instance(onResponse) {
    ec2.runInstances(ec2Params, onResponse)
  }

  function createDigiOceaninstance(onResponse){
   var data = 
   {
    "name": 'sbora-HW1',
    "region": 'nyc3',
    "size": "512mb",
    "image": "ubuntu-14-04-x64",
        "ssh_keys":[config.digi_sshId],
        "backups":false,
        "ipv6":false,
        "user_data":null,
        "private_networking":null
      };

      needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );

    }
    function getEc2IP(onResponse) {
      console.log("fetching ec2 ips")
      ec2.describeInstances(function(err, result) {
        if (err)
          console.log(err);
        var inst_id = '-';
        var ec2_publicIP
        for (var i = 0; i < result.Reservations.length; i++) {
          var res = result.Reservations[i];
          var instances = res.Instances;
          for (var j = 0; j < instances.length; j++) {
           var instanceID = instances[j].InstanceId;
           var state = instances[0].State.Code;
           var public_ip = instances[0].PublicIpAddress;
                              if ( typeof  public_ip !== 'undefined' )
                                ip_addresses["aws_ec2"].push(public_ip)
                              var imageID = instances[0].ImageId;
                              
                            }

                          }
                          createInventory();

                        })

  }

  function getDropletsIP(onResponse) {
    console.log("fetching droplets ip")
    needle.get('https://api.digitalocean.com/v2/droplets', {headers: headers}, function(error, response) {
      if (!error && response.statusCode == 200)
      var response_body=response.body;
      var droplets = response_body["droplets"]
      for (var i = 0; i < droplets.length; i++) {
        if (typeof droplets[i] != 'undefined')
          ip_addresses["digital_ocean"].push(droplets[i]["networks"]["v4"][0]["ip_address"])
      }
         createInventory()
        })  
    }

  function createInventory(onResponse) {
       console.log("Creating Inventory file...")
       var text = ''
       text += 'aws_ec2 ansible_ssh_host='+ip_addresses["aws_ec2"]+' ansible_ssh_user=ubuntu ansible_ssh_private_key_file='+config.aws_ssh_private_key
       text += '\n'
       //text += 'digital_ocean ansible_ssh_host='+ip_addresses["digital_ocean"]+' ansible_ssh_user=root ansible_ssh_private_key_file='+config.digi_ssh_private_key
       fs.writeFile("./inventory", text, function(err) {
          if (err) console.log(err, err.stack); // an error occurred
        })
	fs.writeFile("../bloghub/redisIP",ip_addresses["aws_ec2"], function(err){
	if (err) console.log(err, err.stack); // an error occurred;
	})
	
     }
     
  function generateInventory(err,resp){
      //getDropletsIP()
      getEc2IP();
    }
    
    function handler(err, stdout, stderr) { console.log(err+stdout+stderr) }

  if (process.argv.length <= 2) {
    console.log("Insufficient arguments")
    console.log("Usage: node <filename> <provision|generate|runAnsible>")
    process.exit(-1)
  }

  else if(process.argv.length > 3){
    console.log("Too many arguments")
    console.log("Usage: node <filename> <provision|generate|runAnsible>")
    process.exit(-1)
  }


  var cmd = process.argv[process.argv.length-1]

  if (cmd === 'provision') {
   createEC2instance(function(err, data) {
     if (err) console.log(err, err.stack); 
      else console.log(data)
    })

   //createDigiOceaninstance(function(err, data) {
     // if (err) console.log(err, err.stack); 
      //else console.log(data)
    //})
  } 
  else if (cmd === 'generate') {
   generateInventory()
  }
  else if (cmd==='deploy') {
    exec("ansible-playbook -i inventory redis.yml", handler)
  }

