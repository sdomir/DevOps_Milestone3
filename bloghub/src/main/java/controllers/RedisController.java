package controllers;

import com.lambdaworks.redis.api.sync.RedisCommands;
import com.lambdaworks.redis.RedisClient;
import com.lambdaworks.redis.RedisConnection;
import com.lambdaworks.redis.RedisURI;
import com.lambdaworks.redis.api.StatefulRedisConnection;

import java.util.concurrent.TimeUnit;


//new RedisURI("localhost", 6379, 60, TimeUnit.SECONDS);

public class RedisController {

	public static StatefulRedisConnection<String, String> Connection;
	 
	public static RedisCommands<String, String> SyncCommands;
    
	public static Boolean getFlag(){
		SyncCommands = Connection.sync();
		String value = SyncCommands.get("flag");
		if(value.equals("1")){
			return true;
		}
		else return false;
	}

	public static void init() {
        // Syntax: redis://[password@]host[:port][/databaseNumber]
        RedisURI myURI = new RedisURI("localhost", 6379, 60, TimeUnit.SECONDS);
		RedisClient redisClient = RedisClient.create(myURI);
        Connection = redisClient.connect();
        SyncCommands = Connection.sync();
        //syncCommands.set("flag","0");

        System.out.println("Connected to Redis");
       	System.out.println("value of flag is: "+SyncCommands.get("flag"));
       // connection.close();
        //redisClient.shutdown();
    }
}
