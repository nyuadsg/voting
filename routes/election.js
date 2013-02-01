var Election = require('../models/election');

exports.view = function(req, res){
	Election.findById(req.params.id, function(error, election){
		res.render("vote", {
			title: election.name,
			election: election,
			races: election.races
		});
  });
};

exports.vote = function(req, res){
	Election.findById(req.params.election, function(error, election){
		race = election.races.id( req.params.race );
		candidate = race.candidates.id( req.params.candidate );
		candidate.votes = candidate.votes + 1;
		race.voters.push( 'mp3255' );
		console.log( race );
		election.save();
		res.render("vote", {
			title: election.name,
			election: election,
			races: election.races
		});
  });
};

exports.list = function(req, res, next){
	Election.find({}, function(error, elections){
		res.render("elections", {
			title: "All Elections",
			elections: elections
		});
  });
};

exports.new = function(req, res){
	var election = new Election({
		name: 'February 2013',
		end: new Date('February 11, 2013'),
		races: [
			{
				name: 'Alternate Senator',
				candidates: [
					{name: 'Morgante'},
					{name: 'Sam'},
					{name: 'Bill'}
				]
			}
		]
	}).save();
};