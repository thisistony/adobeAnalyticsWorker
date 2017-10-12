var DynamoDB = require(process.cwd() + '/lib');

module.exports = {
  definition: {
    year: {
      type: DynamoDB.types.Number,
      index: DynamoDB.types.Hash
    },
    title: {
      type: DynamoDB.types.String,
      index: DynamoDB.types.Range
    }
  },
  options: {
    readCapacity: 10,
    writeCapacity: 20
  }
};
