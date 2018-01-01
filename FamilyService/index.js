'use strict';

console.log('Loading function');

var tableName = "tell-mommy-domain"
var AWS = require("aws-sdk");
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

exports.handler = (family, context, callback) => {
    console.log("Received: " + family);
    
    var updatedFamily = fillOutIds(family);
    
    var params = {
	   TableName : tableName,
	   Item:{
	       "domain-id" : updatedFamily.id,
	       "family" : updatedFamily
	   }
    };

    dynamodbDoc.put(params, function(err, result) {
    	if (err) {
    		callback(err)
    	} else {
    		console.log("Successfully stored family " + family.familyName + " with id " + family.id);
    		callback(null, updatedFamily)
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

function fillOutIds(family) {
    family.id = family.id ? family.id : generateUUID()
    family.parents.forEach(function(parent) {
        parent.id = parent.id ? parent.id : generateUUID()
    })
    family.children.forEach(function(child) {
        child.id = child.id ? child.id : generateUUID()
    })
    
    return family;
}
