'use strict';

console.log('Loading function');

var tableName = "tell-mommy-domain"
var AWS = require("aws-sdk");
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

exports.handler = (chore, context, callback) => {
    console.log("Received: " + chore);
    
    var updatedChore = fillOutIds(chore);
    
    var params = {
	   TableName : tableName,
	   Item:{
	       "domain-id" : updatedChore.id,
	       "chore" : updatedChore
	   }
    };

    dynamodbDoc.put(params, function(err, result) {
    	if (err) {
    		callback(err)
    	} else {
    		console.log("Successfully stored chore " + chore.choreName + " with id " + chore.id);
    		callback(null, updatedChore)
    	}
    });
};

function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function fillOutIds(chore) {
    chore.id = chore.id ? chore.id : generateUUID()
    return chore;
}
