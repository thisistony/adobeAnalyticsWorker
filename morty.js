var AWS = require('aws-sdk'),
q = require ('q'),
request = require('request'),
arrayCount = require('./config/arrayCount.json'),
moment = require('moment'),
ddb = require('dynamodb')

var accessKeyId = process.env.accessKeyId,
secretAccessKey = process.env.secretAccessKey,
endpoint = process.env.endpoint;

function getAdobeToken(){
  var dynamodb = new AWS.DynamoDB();
  var deferred = q.defer();
  var applicationId = applicationId;
  var applicationSecret = applicationSecret;
  // Set the headers
  var headers = {
    'grant_type': 'client_credentials',
    'Authorization': "Basic " + new Buffer(process.env.applicationId + ":" + process.env.applicationSecret).toString('base64')
  }
  // Configure the request
  var options = {
    url: "https://api.omniture.com/token",
    method: 'POST',
    headers: headers,
    form: {'grant_type': 'client_credentials'}
  }
  try{
    // Start the request
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        var parsedReponse = JSON.parse(body);
        var accessToken = parsedReponse.access_token
        deferred.resolve(accessToken);
      }
    })
  }catch(error){
    deferred.reject(error);
    console.log(error)
  }
  return deferred.promise;
}

module.exports.run = function(context){


  var ddb = require('dynamodb').ddb({ accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey, endpoint: endpoint});


    getAdobeToken().then(function(token){
      ddb.getItem('adobeReportIds', 100, null, {}, function(err, res, cap) {


        var reportId = res.reportId
        console.log("Downloading reportId: "+reportId)
        var options = {
          url: "https://api.omniture.com/admin/1.4/rest/?method=Report.Get&access_token="+token,
          method: 'POST',
          form: {'reportID': reportId}
        }
        try{
          // Start the request
          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              // Print out the response body
              var parsedReponse = JSON.parse(body);
              console.log(parsedReponse.report.data.breakdown)
              for(i=0; i<=30; i++){
                var item = {
                  rankingkey: i,
                  titlename: parsedReponse.report.data[i].breakdown[0].name,
                  pathname: parsedReponse.report.data[i].name,
                  pageviews: parsedReponse.report.data[i].counts[0],
                  sortKey : i
                };
                ddb.putItem('top50Fashion', item, {}, function(err, res, cap) {
                  console.log(err);
                });
              }
              // console.log(parsedReponse.report.data);
            }
          })
        }catch(error){
          console.log(error)
        }
      });
    })
  }
