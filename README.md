# Adobe Analytics Report Worker

<div align="center">

<p>✨ <strong>Adobe Analytics Report Worker</strong> is a set of workers that will allow you to schedule/queue Adobe Analytics Reports via the API and uploads the results onto an AWS DynamoDB database. It also has an endpoint worker to query the results.✨</p>

## Overview
<p>This repo consists of three main workers:</p>

* Rick: Queues the report using the Adobe Analytics API and uploads the reportID onto a AWS DynamoDB database with the primary key of '100'
* Morty: Downloads the data from the Adobe Analytics API using the reportID and uploads onto another DynamoDB database.
* Jerry: Downloads the data from the DynamoDB and feeds the API Gateway endpoint.

## Features
* 🔩 <strong>Simple: </strong> Ready to go! Simply change the payload and upload and set up your Lambda/DynamoDB/API Gateway functions.

* 💪 <strong>Reliable: </strong> Runs on AWS so it's very reliable.

### Locally using npm
* Clone/download the repo

* Set up your Lambda/dynamoDB databases/API Gateway.

* Schedule Rick/Morty to run on a regular basis. It will upload the latest data points to the DynamoDB database.

* Attach Jerry to the API Gateway. 

## Questions?
* [@thisistonylu](https://github.com/thisistony)
