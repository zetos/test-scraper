const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
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

module.exports = mongoose.model('Project', projectSchema);
