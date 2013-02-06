// we need mongoose
var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
	name: String,
	votes: {type: Number, default: 0}
});

var raceSchema = new mongoose.Schema({
	name: String,
	candidates: [candidateSchema],
	voters: {type: Array, default: []},
	classes: {type: Array, default: [2014,2015,2016]}
});

var electionSchema = mongoose.Schema({
  name: String,
	end:  {type: Date, default: Date.now},
	races: [raceSchema]
});

electionSchema.methods.vote = function (user, race, candidates) {
	race= this.races.id( race );
	
	// always deal with an array
	if( !Array.isArray( candidates ) )
		candidates = [candidates];
		
	// check if they are in the proper class
	if( race.classes.indexOf( user.class ) == -1 )
	{
		return false;
	}
	
	// check if they have already voted
	if( race.voters.indexOf( user.netID ) != -1 )
	{
		return false;
	}
	
	candidates.forEach( function( element ) {
		race.candidates.id( element ).votes = race.candidates.id( element ).votes + 1;
	});
	
	// add them to the list of voters
	race.voters.push( user.netID );
	
	return true;
}

var Election = module.exports = mongoose.model('Election', electionSchema);