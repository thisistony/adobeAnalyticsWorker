var Model = require(process.cwd() + '/lib/model');
var Sync = require(process.cwd() + '/lib/sync');
var types = require(process.cwd() + '/lib/types');

function DynamoDB(details) {
  if (!details) {
    details = {};
  }

  var log = function(...args) {
    console.log(...args); // eslint-disable-line no-console
  };

  this.logger = details.logger || {
    fatal: log,
    error: log,
    warn: log,
    info: log,
    debug: log,
    trace: log,
    child: function() { return this; }
  };

  this.models = {};

  return this;
}

DynamoDB.prototype.types = types;

DynamoDB.prototype.model = function(name, schema) {
  var model = Model.compile({
    modelName: name,
    definition: schema.definition,
    options: schema.options,
    connection: this.connection,
    env: this.env,
    database: this.database,
    logger: this.logger
  });

  this.models[name] = model;

  return model;
};

DynamoDB.prototype.connect = function(options, callback) {
  this.connection = options.connection;
  this.database = options.database;
  this.env = options.env;

  Sync.perform(this, function(err, syncStats) {
    if (err) {
      return callback(err);
    }

    callback(null, { sync: syncStats });
  });
};

DynamoDB.prototype.Schema = function(definition, options) {
  return {
    definition: definition,
    options: options
  };
};

module.exports = new DynamoDB;
