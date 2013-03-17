// we need mongoose
var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
	name: String,
	year: Number,
	photo: String,
	votes: {type: Array, default: []}
});

candidateSchema.virtual('shortyear').get(function () {
  return this.year.toString().substr(2,4);
});

var raceSchema = new mongoose.Schema({
	name: String,
	candidates: [candidateSchema],
	voters: {type: Array, default: []},
	classes: {type: Array, default: [2014,2015,2016]}
});

var electionSchema = mongoose.Schema({
  name: String,
	open: Boolean,
	races: [raceSchema]
});

electionSchema.methods.vote = function (user, race, candidates) {
	race= this.races.id( race );
		
	// check if they are in the proper class
	if( race.classes.indexOf( user.class ) == -1 )
	{
		return true; // silently fail
	}
	
	// check if they have already voted
	if( race.voters.indexOf( user.netID ) != -1 )
	{
		return false;
	}
	
	if( candidates != null )
	{
		// always deal with an array
		if( !Array.isArray( candidates ) )
			candidates = [candidates];
		
		candidates.forEach( function( element ) {
			race.candidates.id( element ).votes.push( user.netID );
		});
	}
	
	// add them to the list of voters
	race.voters.push( user.netID );
	
	return true;
}

var Election = module.exports = mongoose.model('Election', electionSchema);