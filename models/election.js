// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');

var candidateSchema = new mongoose.Schema({
	name: String,
	year: Number,
	photo: String,
	bio: {type: String},
	votes: {type: Array, default: []}
});

candidateSchema.virtual('shortyear').get(function () {
	if( this.year == undefined )
	{
		return null;
	}
	
  return this.year.toString().substr(2,4);
});

candidateSchema.virtual('tally').get(function () {
  return this.votes.length;
});

var raceSchema = new mongoose.Schema({
	name: String,
	candidates: [candidateSchema],
	school: {type: String, default: 'all'},
	voters: {type: Array, default: []},
	classes: {type: Array, default: [2014,2015,2016,2017]},
	groups: {type: Array, default: []} // an empty array means all groups
});

raceSchema.methods.canVote = function( user ) {
	// check groups
	if( this.groups.length > 0 ) // empty groups means all
	{		
		if( _.intersection( this.groups, user.groups ) < 1 )
		{
			return false;
		}
	}
	
	// check classes
	if( this.classes.indexOf( user.class ) == -1 )
	{
		return false;
	}
	
	// check school
	if( this.school != 'all' && this.school != user.school )
	{
		return false;
	}
	
	return true;
}

var electionSchema = mongoose.Schema({
  name: String,
	open: {type: Boolean, default: true},
	races: [raceSchema],
	constituency: {type: String, default: 'all'}
});

electionSchema.methods.vote = function (user, race, candidates) {
	race= this.races.id( race );
	
	// check if they have permission to vote in this race
	if( !race.canVote( user ) )
	{
		return true; // silently fail
	}
	
	// check if they have already voted
	if( race.voters.indexOf( user.netID ) != -1 )
	{
		// return false;
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