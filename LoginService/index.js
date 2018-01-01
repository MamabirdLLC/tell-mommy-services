'use strict';

var md5 = require('md5');
var tableName = "tell-mommy-accounts";
var AWS = require("aws-sdk");
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var email = event.email;
    var password = event.password;
    var hashedPassword = md5(password);
    
    if (event.action == "register") {
        var familyId = event.familyId;
        register(email, hashedPassword, familyId, callback);
    } else if (event.action == "login") {
        verifyPassword(email, hashedPassword, function (err, familyId) {
           if (err) callback(err);
           else callback(null, familyId);
        });
    } else {
        callback("Invalid request");
    }
};

function getAccountForEmail(email, callback) {
    var params = {
        TableName : tableName,
        Key: {
            email: email
        }
    };
    
    console.log(params);
    
    dynamodbDoc.get(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
          callback(err);
      } else {
          console.log(data);
          if (data.Item) {
            callback(null, data.Item);    
          } else {
            callback("Not Found");
          }
      }
    });
}

function verifyPassword(email, hashedPassword, callback) {
    getAccountForEmail(email, function(err, account) {
        if (err) callback(err);
        else if (account.hashedPassword === hashedPassword) {
            callback(null, account.familyId);
        } else {
            callback("Invalid password.");
        }
    });
}

function register(email, hashedPassword, familyId, callback) {
    getAccountForEmail(email, function(err, account) {
        if (account) callback("An account already exists for this email address.");
        else if (err == "Not Found") {
            var newAccount = {
                email: email,
                hashedPassword: hashedPassword,
                familyId: familyId
            };
            
            var params = {
        	   TableName : tableName,
        	   Item: newAccount
            };
            
            dynamodbDoc.put(params, function(err, result) {
            	if (err) {
            		callback(err);
            	} else {
            		console.log("Successfully registered user with email " + email + " with family " + familyId);
            		callback(null, newAccount);
            	}
            });    
        } else {
            callback(err);
        }
    });
}