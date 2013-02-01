// we need mongoose
var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
	name: String,
	votes: {type: Number, default: 0}
});

var raceSchema = new mongoose.Schema({
	name: String,
	candidates: [candidateSchema],
	voters: {type: Array, default: []}
});

var electionSchema = mongoose.Schema({
  name: String,
	end:  {type: Date, default: Date.now},
	races: [raceSchema]
});

electionSchema.methods.vote = function (netID, race, candidate) {
	race= this.races.id( race );
	candidate = race.candidates.id( candidate );
	candidate.votes = candidate.votes + 1;
	race.voters.push( 'mp3255' );
}

var Election = module.exports = mongoose.model('Election', electionSchema);