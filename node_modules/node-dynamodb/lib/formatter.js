var types = require(process.cwd() + '/lib/types');

function Formatter() {}

Formatter.prototype.table = function(tableName, definition, options) {
  var keySchema = [], attributeDefinitions = [], keys = {};
  var definitions = Object.keys(definition);
  for (var i in definitions) {
    var vals = definition[definitions[i]];
    if (vals.index === types.Hash || vals.index === types.Range) {
      keySchema.push({
        AttributeName: definitions[i],
        KeyType: vals.index
      });
    }

    keys[definitions[i]] = vals.type;
    attributeDefinitions.push({
      AttributeName: definitions[i],
      AttributeType: vals.type
    });
  }

  return {
    keys: keys,
    schema: {
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      ProvisionedThroughput: {
        ReadCapacityUnits: options.readCapacity,
        WriteCapacityUnits: options.writeCapacity
      }
    }
  };
};

Formatter.prototype._toDynamoDB = function(raw) {
  return raw;
};

Formatter.prototype._fromDynamoDB = function(raw) {
  return raw;
};

Formatter.prototype.putItem = function(tableName, rawItem, table) {
  var item = {};

  var itemKeys = Object.keys(rawItem);
  for (var i in itemKeys) {
    var key = itemKeys[i];
    if (!item[key]) {
      item[key] = {};
    }

    var val = rawItem[key];
    if (typeof val === 'number') {
      val = val.toString();
    }

    item[key][table.keys[key]] = val;
  }

  return {
    TableName: tableName,
    Item: item
  };
};

Formatter.prototype.getItem = function(tableName, rawItem, table) {
  var item = {};

  var itemKeys = Object.keys(rawItem);
  for (var i in itemKeys) {
    var key = itemKeys[i];
    if (!item[key]) {
      item[key] = {};
    }

    item[key][table.keys[key]] = rawItem[key];
  }

  return {
    TableName: tableName,
    Key: item
  };
};

module.exports = new Formatter();
