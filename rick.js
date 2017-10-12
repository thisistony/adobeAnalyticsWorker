var AWS = require('aws-sdk'),
q = require ('q'),
requestPayload = require('./config/requestPayload.json')
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
  console.log(accessKeyId)
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
        console.log(accessToken)
        deferred.resolve(accessToken);
      }
    })
  }catch(error){
    deferred.reject(error);
    console.log(error)
  }
  return deferred.promise;
}


module.exports.run = function(){

  getAdobeToken().then(function(token){
    console.log(accessKeyId)
    var d = new Date(); // Today!
    var yesterday = d.setDate(d.getDate() - 1); // Yesterday
    var thirtyDaysAgo = d.setDate(d.getDate() - 30); //30 days ago
    var yesterday = moment(yesterday).format("YYYY-MM-DD");
    var thirtyDaysAgo = moment(thirtyDaysAgo).format("YYYY-MM-DD");
    console.log(yesterday);
    console.log(thirtyDaysAgo);
    var deferred = q.defer();
    var url = 'https://api.omniture.com/admin/1.4/rest/?method=Report.Queue&access_token='+token;
    var options = {
      url : url,
      method: 'POST',
      form: {
        "reportDescription": {
          "anomalyDetection": false,
          "currentData": false,
          "segments": [
            {
              "id": "s122_57b46ea2e4b0f6532970e865"
            }
          ],
          "dateFrom": thirtyDaysAgo,
          "sortBy": "pageviews",
          "dateTo": yesterday,
          "reportSuiteID": "cnn-adbp-intl",
          "elementDataEncoding": "utf8",
          "breakdownType": "correlation",
          "locale": "en_US",
          "metrics": [
            {
              "id": "pageviews"
            }
          ],
          "elements": [
            {
              "id": "prop26",
              "top": 50,
              "startingWith": 1,
              "search": {
                "type": "and",
                "keywords": [],
                "searches": [
                  {
                    "type": "not",
                    "keywords": [
                      "::unspecified::"
                    ]
                  }
                ]
              }
            },
            {
              "id": "prop23",
              "top": 1,
              "startingWith": 1
            }
          ],
          "expedite": false
        }
      }
    }
    request(options, function (error, response, body) {

      var ddb = require('dynamodb').ddb({ accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey, endpoint: endpoint});
        if (!error && response.statusCode == 200) {
          // Print out the response body
          var parsedReponse = JSON.parse(body);
          console.log("Success!")
          var reportId = parsedReponse.reportID
          console.log("reportId")
          var item = {
            pkey: 100,
            reportId: reportId
          };
          ddb.putItem('adobeReportIds', item, {}, function(err, res, cap) {
            console.log(err);
          });
        }else{
          console.log("Error found!")
          console.log(error)
        }
      })
    })
  }
