var Election = require('../models/election');
var User = require('../models/user');

var admins = ['mp3255'];

check_constituency = function( user, con )
{
	if( con == 'AD' )
	{
		if( user.site == 'AD' || user.school == 'NYUAD' )
		{
			return true;
		}
	}
	else if( con == 'NY' )
	{
		if( user.site == 'NY' )
		{
			return true;
		}
	}
	else if( con == 'all' )
	{
		return true;
	}
	return false;
}

exports.info = function( req, res ) {
	// res.redirect( 'http://voting.sg.nyuad.org/election/5116ab7ec269d30200000003/vote' );
	res.render("index", {
		title: 'Student Government Elections',
		start: 'February 9th'
	});
}

exports.view = function(req, res){
	Election.findById(req.params.id, function(error, election){
		
		if( !check_constituency( req.user, election.constituency ) )
		{
			res.setHeader('Content-Type', 'text/plain');
			res.end( 'You are not in the constituency for this election.' );
			return;
		}
		
		var races = [];
				
		// only pull in races I can vote in
		election.races.forEach( function( element ) {
			if( element.canVote( req.user ) )
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

exports.confirm = function(req, res){
	Election.findById(req.params.id, function(error, election){
		
		if( !check_constituency( req.user, election.constituency ) )
		{
			res.setHeader('Content-Type', 'text/plain');
			res.end( 'You are not in the constituency for this election.' );
			return;
		}
		
		var races = [];
		
		var selections = [];
		
		// only pull in races I can vote in
		election.races.forEach( function( element ) {
			if( element.canVote( req.user ) )
			{				
				selections[element.id] = element.candidates.id( req.body[element.id] );
				races.push(element);
			}
		});
		
		// console.log( races );
						
		res.render("confirm", {
			title: election.name,
			admin: false,
			election: election,
			selections: selections,
			races: races
		});
		
		// election.races.forEach( function( element ) {
		// 			if( !election.vote( user, element.id, req.body[element.id] ) ) {
		// 				success = false;
		// 			}
		// 		});
		// 		if( success )
		// 		{
		// 			election.save(function (err) {
		// 			  if (err) {
		// 					res.render("failure", {
		// 						title: election.name,
		// 						reason: 'Results couldn&apos;t be saved.'
		// 					});
		// 				} else {
		// 					res.render("success", {
		// 						title: election.name,
		// 						name: election.name,
		// 						admin: admin,
		// 						url: req.url
		// 					});
		// 				}
		// 			});
		// 			
		// 		}
		// 		else
		// 		{
		// 			res.render("failure", {
		// 				title: election.name,
		// 				reason: 'You already voted.'
		// 			});
		// 		}		
  });
};

exports.admin = function(req, res){
	Election.findById(req.params.id, function(error, election){
		var races = election.races;
				
		res.render("vote", {
			title: election.name,
			admin: true,
			election: election,
			races: races
		});
  });
};

exports.results = function(req, res){
	Election.findById(req.params.id, function(error, election){
		var races = election.races;
				
		res.render("results", {
			title: election.name,
			election: election,
			races: races
		});
  });
};

exports.vote = function(req, res){
	Election.findById(req.params.id, function(error, election){
		
		if( !check_constituency( req.user, election.constituency ) )
		{
			res.setHeader('Content-Type', 'text/plain');
			res.end( 'You are not in the constituency for this election.' );
			return;
		}
		
		success = true;
		
		if( req.body["netID"] )
		{
			user = {
				netID: req.body["netID"],
				class: 2014 // eh!?
			};
			admin = true;
			
			// console.log( req.body );
						
			User.create({ netID: req.body["netID"], RFID: req.body["RFID"] }, function (err, insert) {
			  // if (err) return handleError(err);
			  // console.log( err, { netID: req.body["netID"], RFID: req.body["RFID"] } );
			});
		}
		else
		{
			// console.log( { netID: req.body["netID"], RFID: req.body["RFID"] } );
			
			user = req.user;
			admin = false;
		}
		
		election.races.forEach( function( element ) {
			if( !election.vote( user, element.id, req.body[element.id] ) ) {
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
						name: election.name,
						admin: admin,
						url: req.url
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
};

exports.list = function(req, res, next){
	Election.find({}, function(error, elections){
		if( elections.length == 1 )
		{
			res.redirect( process.env.BASE_URL + '/election/' + elections[0].id + '/vote' );
		}
		
		res.render("elections", {
			title: "All Elections",
			elections: elections
		});
  });
};

exports.new = function( req, res, next ) {
	if( req.user.groups.indexOf( 'admins' ) == -1 )
	{
		res.redirect( process.env.BASE_URL );
	}
	else
	{
		res.render("new_election", {
			title: 'Create election'
		});
	}
}

exports.create = function( req, res, next ) {
	if( req.user.groups.indexOf( 'admins' ) == -1 )
	{
		res.redirect( process.env.BASE_URL );
	}
	else
	{
		schema = JSON.parse( req.body.schema );
		
		Election.create( schema, function( err, election ) {
			res.redirect( process.env.BASE_URL + '/election/' + election.id + '/vote' )
		});
	}
}