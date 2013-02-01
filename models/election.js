// we need mongoose
var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
	name: String,
	votes: Number
});

var raceSchema = new mongoose.Schema({
	name: String,
	candidates: [candidateSchema],
	voters: Array
});

var electionSchema = mongoose.Schema({
  name: String,
	end:  {type: Date, default: Date.now},
	races: [raceSchema]
});

var Election = module.exports = mongoose.model('Election', electionSchema);