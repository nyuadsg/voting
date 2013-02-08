var Election = require('../models/election');

var admins = ['mp3255'];

exports.info = function( req, res ) {
	res.render("index", {
		title: 'Student Government Elections',
		start: 'February 9th'
	});
}

exports.view = function(req, res){
	Election.findById(req.params.id, function(error, election){
		var races = [];
		
		// only pull in races I can vote in
		election.races.forEach( function( element ) {
			if( element.classes.indexOf( req.user.class ) != -1 )
			{
				races.push( element );
			}
		});
				
		res.render("vote", {
			title: election.name,
			admin: false,
			election: election,
			races: races
		});
  });
};

exports.vote = function(req, res){
	Election.findById(req.params.id, function(error, election){
		success = true;
		election.races.forEach( function( element ) {
			if( !election.vote( req.user, element.id, req.body[element.id] ) ) {
				success = false;
			}
		});
		if( success )
		{
			election.save(function (err) {
			  if (err) {
					res.render("failure", {
						title: election.name,
						reason: 'Results couldn&apos;t be saved.'
					});
				} else {
					res.render("success", {
						title: election.name,
						name: election.name
					});
				}
			});
			
		}
		else
		{
			res.render("failure", {
				title: election.name,
				reason: 'You already voted.'
			});
		}		
  });
	
	// Election.findById(req.params.id, function(error, election){
	// 	var netID = req.body.netID;	
	// 	var votes = JSON.parse( req.body.votes );
	// 	election.races.forEach( function( element ) {
	// 		console.log( element );
	// 		
	// 	});
	// 	// Object.keys(votes).forEach(function(key, a, _array) {
	// 	// 	val = votes[ key ];
	// 	// 	election.vote( netID, key.replace(/['"]/g,''), val );
	// 	// });
	// 	// election.save();
	//   });
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
	if( admins.indexOf( req.user.netID ) == -1 ) {
		res.redirect(  process.env.base_url );
	}
	else
	{
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
						{name: 'Bill'},
						{name: 'Dawg'},
						{name: 'Samthony'}
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
		}).save(function() {
			res.redirect(  process.env.base_url );
		});
	}
};