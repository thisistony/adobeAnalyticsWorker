var expect = require('chai').expect;
var async = require('async');

module.exports.url = 'http://localhost:4337';
module.exports.clear = function(dynamodb, done) {
  async.auto({
    list: function(next) {
      dynamodb.listTables({}, function(err, data) {
        expect(err).to.be.a('null');
        expect(data).to.have.property('TableNames');
        next(null, data.TableNames);
      });
    },
    remove: ['list', function(data, next) {
      async.each(data.list,
        function(table, removed) {
          dynamodb.deleteTable({
            TableName: table
          }, removed);
        }
      , next);
    }]
  }, done);
};
