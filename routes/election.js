var Election = require('../models/election');

var admins = ['mp3255'];

exports.info = function( req, res ) {
	res.redirect( 'http://voting.sg.nyuad.org/election/5116ab7ec269d30200000003/vote' );
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
		var election = new Election({
			name: 'Spring 2013',
			open: true,
			races: [
				{
					name: 'President',
					candidates: [
						{name: 'Alex Nyikos', year: 2015, photo: 'http://voting.sg.nyuad.org/photos/alex.jpg'},
						{name: 'Andrew Pitts', year: 2014, photo: 'http://voting.sg.nyuad.org/photos/andrew.jpg'},
						{name: 'Leah Reynolds', year: 2014, photo: 'http://voting.sg.nyuad.org/photos/leah.jpg'},
						{name: 'Massimiliano Valli', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/max.jpg'},
						{name: 'Otari (Otto) Kakhidze', year: 2015, photo: 'http://voting.sg.nyuad.org/photos/otto.jpg'},
					]
				},
				{
					name: 'Vice President',
					candidates: [
						{name: 'Andres Rodriguez', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/andres.jpg'},
						{name: 'Corey Meyer', year: 2015, photo: 'http://voting.sg.nyuad.org/photos/corey.jpg'}
					]
				},
				{
					name: 'Senator',
					candidates: [
						{name: 'Geo Kamus', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/geo.jpg'},
						{name: 'Hassan Syed', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/hassan.jpg'}
					]
				},
				{
					name: 'Alternate Senator',
					candidates: [
						{name: 'Clara Bicalho Maia Correia', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/clara.jpg'},
						{name: 'Morgante Pell', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/morgante.jpg'}
					]
				},
				{
					name: 'Secretary',
					candidates: [
						{name: 'Veronica Houk', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/veronica.jpg'},
					]
				},
				{
					name: 'Treasurer',
					candidates: [
						{name: 'Angela Ortega Pastor', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/angela.jpg'},
						{name: 'Angelina Micha Djaja', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/angelina.jpg'},
					]
				},
				{
					name: 'Class of 2014 Representative',
					candidates: [
						{name: 'Irene Paneda', year: 2014, photo: 'http://voting.sg.nyuad.org/photos/irene.jpg'},
					]
				},
			]
		}).save(function() {
			res.redirect(  process.env.base_url );
		});
};