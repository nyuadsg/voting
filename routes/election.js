var Election = require('../models/election');
var User = require('../models/user');

var admins = ['mp3255'];

exports.info = function( req, res ) {
	// res.redirect( 'http://voting.sg.nyuad.org/election/5116ab7ec269d30200000003/vote' );
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

exports.confirm = function(req, res){
	Election.findById(req.params.id, function(error, election){
		
		var races = [];
		
		var selections = [];
		
		// only pull in races I can vote in
		election.races.forEach( function( element ) {
			if( element.classes.indexOf( req.user.class ) != -1 )
			{				
				selections[element.id] = element.candidates.id( req.body[element.id] );
				races.push(element);
			}
		});
		
		console.log( races );
						
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
								{name: 'Alex Nyikos', year: 2015, photo: 'http://voting.sg.nyuad.org/photos/alex.jpg', bio: 'This year will be a very important and transitional one for our university and student government. Preparations for the move to the Saadiyat Island campus will be intensifying, and it will be very important for us as a student body to ensure that our collective voice is heard in the planning process. This year, we will have the truly unique opportunity to begin making the new campus our own. The last student government was responsible for the creation of the SIG funding structure, the Safe Space Policy, the Honor Code, and many other policies that help make our student experience what it is. The next government will have to ensure the sustainability of these structures in the context of a full campus; we will need to guarantee that funding structures are as efficient and responsive as possible. In the case of SIGs, this could be done by boosting the hours available to exchange funds and allowing leftover funds for individual SIGs to roll over to future semesters, for example. I am running for student body president with the hope that you will entrust me with the responsibility and privilege to represent you through this very exciting period for our university.'},
								{name: 'Andrew Pitts', year: 2014, photo: 'http://voting.sg.nyuad.org/photos/andrew.jpg', bio: 'It’s a hard thing to run for office. You have to put yourself out there. Here I am: My name is Andrew, I’m a junior, a philosophy and literature major, and the colour of my beard does not match the colour of my hair. For me, this school is everything. If I hadn’t come to NYUAD I have no idea what I would have done. I’ll go right out there and say it: This school has come a long way, in three short years we have gone from being nothing to a real living and breathing community. However, that journey is far from over. I truly believe that NYUAD has the potential to revolutionize the way education is viewed throughout the world. However, while ‘well begun is half-way done’ we still have so much left to do.'},
								{name: 'Leah Reynolds', year: 2014, photo: 'http://voting.sg.nyuad.org/photos/leah.jpg', bio: 'One thing I’ve learned as part of NYUAD’s inaugural class is that we’re a community of people who can cast a vision and build great things where they didn’t exist before. I’ve also found that my strength in this entrepreneurial process lies in solidifying existing structures, and in refining and organizing what’s been built. In the past two years I’ve co-lead SIGs, interned on campus, and served on committees to discuss issues like the the Honor Code. Through this I’ve gained the experience and perspective needed to work efficiently and productively for our community. By staying in Abu Dhabi, I’ve had the privilege of connecting deeply to both our university community and the city we live in. During the next year each NYUAD class will crave stability in different ways. Juniors need clear communication regarding capstones and commencement so we can leave a worthwhile legacy. Sophomores, and all those returning from study abroad, need smooth transitions that maintain a sense of community. Freshman need to be fully integrated into that community and equipped for leadership roles. Previous student governments have built a solid foundation, and I’d like to lead as president in fulfilling our responsibility to build upon it well.'},
								{name: 'Massimiliano Valli', year: 2016, photo: 'http://voting.sg.nyuad.org/photos/max.jpg', bio: 'The President of Student Government has a crucial role in guiding NYU Abu Dhabi through these formative years. Raising and maintaining high standards will thus be essential in developing a Student Government that not only helps and represents the current Student Body but will also serve similar functions for future students. In order to accomplish this, as president, I promise to enhance NYU Abu Dhabi’s “eco-friendly” capacity by establishing a bike system and make government more transparent by reforming the committee system and provide more thorough minutes. I promise to assist in developing and fostering NYUAD’s intellectual community by establishing a system (similar to Dartmouth’s) through which students can take professors out past the confines of Sama Tower and DTC. I believe in keeping the Student Body not only informed but also a part of the policy discussion at the school. This includes having the administration give a presentation on Saadiyat Island and working with the office of the Provost to improve NYUAD’s rudimentary curriculum. Communication is key for every leader, and I promise to bring innovative ideas and to listen to you. I would be honored to serve you as President of the Student Government.'},
								{name: 'Otari (Otto) Kakhidze', year: 2015, photo: 'http://voting.sg.nyuad.org/photos/otto.jpg', bio: 'It would be my sincere honor to serve you as Vice President of Student Government. I bring my experiences as a former Student Body President, an active attendee of General Assembly meetings, and a SIG leader. As your Vice President I would focus on improving the student funding process through increased access for SIG reimbursement. Furthermore, over the next several semesters we need to reorient planning to focus on the upcoming transition to Saadiyat Island. This means an increased focus on sustainability and transferability of all Student Government services and programs for future students. Today, the maintenance of these services present challenges in upkeep that must be met with careful decisions to ensure the survival of these services. Specifically, a system for maintaining equipment in the student lounge needs to be designed to prevent damage and loss. Outside the realm of tangible services, I would continue the tradition of heavy student involvement in the crafting and reform of academic and student life policy by ensuring all students have a voice in the policy design process. I am excited for the possibility to serve you and our community. I hope I can count on your support.'},
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
					res.redirect(  process.env.BASE_URL );
				});
};