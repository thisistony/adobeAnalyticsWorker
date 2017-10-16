var AWS = require('aws-sdk'),
q = require ('q'),
requestPayload = require('./config/requestPayload.json')
request = require('request'),
arrayCount = require('./config/arrayCount.json'),
moment = require('moment'),
ddb = require('dynamodb')

var accessKeyId = process.env.accessKeyId,
secretAccessKey = process.env.secretAccessKey,
endpoint = process.env.endpoint,
applicationId = process.env.applicationId,
applicationSecret = process.env.applicationSecret;

function topArticleDownload(){

  console.log(accessKeyId);

  var ddb = require('dynamodb').ddb({ accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey, endpoint: endpoint});

    var deferred = q.defer();
    var topThirty = [];
    for(t=0; t<=30; t++){
      ddb.batchGetItem({'top50Fashion': { keys: arrayCount}}, function(err, res) {
        if(err) {
          console.log(err);
        } else {
          // console.log(res);
          deferred.resolve(res.items);
        }
      });
    }
    return deferred.promise;
  }

  module.exports.run = function(event, context){
    topArticleDownload().then(function(topThirty){
      topThirty.sort(function(a, b) {
        return parseFloat(a.sortKey) - parseFloat(b.sortKey);
      });
      console.log(topThirty)
      context.done (null, {topThirty});
    })
  }
