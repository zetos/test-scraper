const mongoose = require('mongoose');

require('dotenv').config();

const { searchForKeyWord } = require('./scraper');
const Project = require('./model');

const mongoConnect = uri => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .catch(error => console.error('Mongoose connect error:', error.message));

  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
  });
};

const main = async () => {
  const uri = process.env.MONGO_URI;
  const keyword = 'transporte';
  await mongoConnect(uri);
  const data = await searchForKeyWord(keyword);
  data.forEach(async proj => {
    const newProject = new Project({ ...proj });
    try {
      await newProject.save();
      console.log('newProject Saved !!');
    } catch (err) {
      console.error('Save err:', err.message);
    }
  });
};

main();
