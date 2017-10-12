var async = require('async');

function Sync() {}

Sync.prototype.setupTable = function(model, done) {
  var self = this;

  this.connection.db.createTable(
    model.table.schema,
      function(err) {
        if (err) {
          if (err.code === 'ResourceInUseException') {
            // Table already exists
            return done(null, { operation: 'none' });
          }

          self.logger.error(err);
          return done(err);
        }

        self._waitForTable(model, done);
      }
  );
};

// Helper method that polls status of a table until it becomes available.
// Note that this assumes the table name has already been passed through the
// helper method to namespace it, as this should only be used internally
// to this service.
Sync.prototype._waitForTable = function(model, done, retry) {
  var self = this;

  if (!retry) {
    retry = 0;
  }

  this.connection.db.describeTable(
    { TableName: model.tableName },
    function(err, details) {
      if (err) {
        return done(err);
      }

      if (details.Table.TableStatus.toLowerCase() === 'active') {
        // The table is ready to go.
        return done(null, { operation: 'created', afterRetry: retry });
      }

      if (retry > 10) {
        self.logger.warn('Waiting for table ' + self.tableName + ' but still in state: ' + details.Table.TableStatus);
      }

      // Table is not ready yet, poll again after a backoff
      setTimeout(function() {
        self._waitForTable(done, retry + 1);
      }, 200 * retry + 1);
    }
  );
};

Sync.prototype.perform = function(instance, callback) {
  this.models = instance.models;
  this.connection = instance.connection;
  this.logger = instance.logger;
  var self = this;

  var models = Object.keys(this.models);
  var stats = {
    none: [],
    updated: [],
    created: []
  };

  if (models.length) {
    async.eachSeries(
      this.models,
      function(model, next) {
        self.setupTable(model, function(err, info) {
          if (err) {
            return next(err);
          }

          stats[info.operation].push(model.modelName);
          next();
        });
      },
      function(err) {
        if (err) {
          return callback(err);
        }

        callback(null, stats);
      }
    );
  } else {
    return callback(null, stats);
  }
};

module.exports = new Sync;
