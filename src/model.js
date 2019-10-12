const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
