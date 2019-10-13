# test-scraper

A scraper built for extracting the information of a **specific** [static web page](http://www.legislador.com.br/) using NodeJS, and uploading the resulting data to a MongoDB.

## Setup

Create a `.env` file in the root of the project with varriable **MONGO_URI** and the connection string.  
Example:

```
    MONGO_URI=mongodb+srv://zeno:paradox@temporis-cfgkw.mongodb.net/test?retryWrites=true&w=majority
```

Then install and run the start script:

```sh
npm i
npm start
```

After that the data will be recorded in the DB.

## Schema
> **WARNING:** The `title` is record as unique, and the `procedure` takes an array of objects of size **n**, so the `Schema.Types.Mixed` was necessary to maintain the flexibility.

The format of recorded data:

```js

Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  situation: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  ementa: {
    type: String,
    required: true
  },
  procedure: Schema.Types.Mixed
});

```

