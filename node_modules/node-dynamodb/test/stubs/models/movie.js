var DynamoDB = require(process.cwd() + '/lib');
var stub = require(process.cwd() + '/test/stubs/schemas/movie');
var schema = new DynamoDB.Schema(stub.definition, stub.options);

module.exports = DynamoDB.model('Movies', schema);
