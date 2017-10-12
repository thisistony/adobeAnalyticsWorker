## node-dynamodb [![CircleCI](https://circleci.com/gh/danamajid/node-dynamodb.svg?style=svg&circle-token=ecce8b4678b87c308c3914f63ea9d21cddd27f9a)](https://circleci.com/gh/danamajid/node-dynamodb)

A (work-in-progress) Mongoose-like API for DynamoDB

### DynamoDB

__Example:__

```js
var DynamoDB = require('node-dynamodb');
```

### Methods

#### DynamoDB.model(schema, options)

Define your model.

__Example:__

```js
var Movie = DynamoDB.model('Movies', new DynamoDB.Schema({
  year: {
    type: DynamoDB.types.Number,
    index: DynamoDB.types.Hash
  },
  title: {
    type: DynamoDB.types.String,
    index: DynamoDB.types.Range
  }
}, {
  readCapacity: 10,
  writeCapacity: 20
}));
```


#### DynamoDB.connect(options, callback);

Connect, and sync your defined models.

* `env` - The environment
* `database` - The environment
* `connection` - Object with an instance of `new AWS.DynamoDB` for `db` and `new AWS.DynamoDB.DocumentClient` for `client`
* `logger` - Optional interface that implements `info`, `warn`, `error`, `fatal`, `debug`, `trace` and `child`.

__Example:__

```js
DynamoDB.connect({
  env: 'dev',
  database: 'biem',
  connection: {
    db: new AWS.DynamoDB({
      endpoint: new AWS.Endpoint('http://localhost:4337')
    }),
    client: new AWS.DynamoDB.DocumentClient({
      endpoint: new AWS.Endpoint('http://localhost:4337')
    })
  }
}, function(err, data) {
  console.log(data);
  /*
  {
    sync: {
      none: [],
      created: ['Movies'],
      updated: []
    }
  }
  */
});
```


#### Movie.put(details, callback);

Put an item.

__Example:__

```js
Movie.put({
  year: 2001,
  title: 'A Beautiful Mind'
}, done);
```

#### Movie.get(details, callback);

GET an item.

__Example:__

```js
Movie.get({
  year: 2001,
  title: 'A Beautiful Mind'
}, done);
```

#### Author

* Contact: [hi@danamajid.com][1]
* Twitter: [http://twitter.com/dnmjd][2] 

  [1]: mailto:hi@danamajid.com
  [2]: http://twitter.com/dnmjd


#### Credits

Shout out to [Nathan Peck](https://github.com/nathanpeck) for sharing his exploration project
