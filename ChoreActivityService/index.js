'use strict';

console.log('Loading function');

var tableName = "tell-mommy-transactions"
var AWS = require("aws-sdk");
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

exports.handler = (transaction, context, callback) => {
    console.log("Received: " + transaction);
    
    var partitionKey = createPartitionKey(transaction);
    var timestamp = (new Date()).getTime();
    
    var params = {
	   TableName : tableName,
	   Item:{
	       "family_child_chore_id" : partitionKey,
	       "timestamp" : timestamp
	   }
    };

    dynamodbDoc.put(params, function(err, result) {
    	if (err) {
    		callback(err)
    	} else {
    		console.log("Successfully recorded transaction for " + partitionKey + " at " +timestamp);
    		callback(null, params.Item)
    	}
    });
};
    
function createPartitionKey(transaction) {
    return transaction.familyId + "_" + transaction.childId + "_" + transaction.choreId;
}
