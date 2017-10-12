var formatter = require(process.cwd() + '/lib/formatter');

function Model() {}

/*
 * Compile model
 *
 */
Model.compile = function(globals) {
  function model() {}

  model.__proto__ = Model;
  model.prototype.__proto__ = Model.prototype;

  // Apply all global properties/methods
  var dependencies = Object.keys(globals);
  for (var i in dependencies) {
    model[dependencies[i]] = globals[dependencies[i]];
  }

  // Apply all model methods
  for (var method in Model.prototype) {
    model[method] = Model.prototype[method];
  }

  // Generate table name
  this.tableName = [model.env, model.database, model.modelName].join('.');
  this.table = formatter.table(this.tableName, model.definition, model.options);

  return model;
};

Model.prototype.put = function(details, done) {
  this.connection.db.putItem(
    formatter.putItem(this.tableName, details, this.table),
    done
  );
};

Model.prototype.get = function(details, done) {
  this.connection.db.getItem(
    formatter.getItem(this.tableName, details, this.table),
    done
  );
};

module.exports = Model;
