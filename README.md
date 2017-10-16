# Adobe Analytics Report Worker

This repo consists of three main workers:

* Rick: Queues the report using the Adobe Analytics API and uploads the reportID onto a AWS DynamoDB database with the primary key of '100'
* Morty: Downloads the data from the Adobe Analytics API using the reportID and uploads onto another DynamoDB database.
* Jerry: Downloads the data from the DynamoDB and feeds the API Gateway endpoint.
