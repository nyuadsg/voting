// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');
var http = require('http');

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
	// check classes -- we don't do this anymore (use groups)
	// if( this.classes.indexOf( user.class ) == -1 )
	// {
	// 	return false;
	// }
	// 
	// // check school -- we don't do this anymore (use groups)
	// if( this.school != 'all' && this.school != user.school )
	// {
	// 	return false;
	// }
	
	// check if they have already voted
	if( this.voters.indexOf( user.netID ) != -1 )
	{
		return false;
	}
	
	return true;
}

var electionSchema = mongoose.Schema({
  name: String,
	open: {type: Boolean, default: false},
	owners: {type: Array, default: [ "admins" ] }, // who controls the election
	races: [raceSchema],
	constituency: {type: String, default: 'all'},
	directions: {type: String, default: 'For each office, select your chosen candidate or <em>no confidence</em>. When you have finished, simply click <strong>Vote</strong>.'},
	confirmation: {type: Boolean, default: false},
});

electionSchema.virtual('status').get(function () {
	if( this.open )
	{
		return 'open';
	}
	else
	{
		return 'closed';
	}
});

// return the races a user can vote in
electionSchema.methods.getRaces = function (user) {
	var races = [];
	
	this.races.forEach( function( element ) {
		if( element.canVote( user ) )
		{
			races.push( element );
		}		
	});
	
	return races;
}

electionSchema.methods.vote = function (user, race, candidates) {
	el = this;
	
	race= this.races.id( race );
	
	// check if they have permission to vote in this race
	if( !race.canVote( user ) )
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
			
			// also send it to Keen.io
			var evData = JSON.stringify({
				"election": el.id,
				"netid": user.netID,
				"race": race.id,
				"candidate": element
			});
			var req = http.request({ // ttps://api.keen.io/3.0/projects/<PROJECT_TOKEN>/events/<EVENT_COLLECTION>
			  host: 'api.keen.io',
			  port: 80,
			  path: '/3.0/projects/' + process.env.KEEN_PROJECT_TOKEN + '/events/votes',
			  method: 'POST',
			  headers: {
				  'Content-Type': 'application/json',
				  'Content-Length': evData.length
				}
			}, function(res) {
				// console.log( res );
			});

			req.write( evData );
			req.end();
		});
	}
	
	// add them to the list of voters
	race.voters.push( user.netID );
	
	return true;
}

var Election = module.exports = mongoose.model('Election', electionSchema);