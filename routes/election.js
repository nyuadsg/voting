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
	Election.findById(req.params.id, function(error, election){
		var netID = req.body.netID;	
		var votes = JSON.parse( req.body.votes );
		Object.keys(votes).forEach(function(key, a, _array) {
			val = votes[ key ];
			election.vote( netID, key.replace(/['"]/g,''), val );
		});
		election.save();
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
			},
			{
				name: 'Cool Guy',
				candidates: [
					{name: 'Morgante'},
					{name: 'Sam'},
					{name: 'Bill'}
				]
			},
			{
				name: 'Slim Jim',
				candidates: [
					{name: 'Morgante'},
					{name: 'Sam'},
				]
			}
		]
	}).save();
};