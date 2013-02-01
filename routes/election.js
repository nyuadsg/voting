var Election = require('../models/election');

// exports.update = function(req, res){
// 	Project.findOneAndUpdate(
// 		{slug: req.params.slug},
// 		{update: new Date().getTime()},
// 		{upsert: true},
// 		function( err, project ) {
// 			if( err )
// 			{
// 				res.send( 'error' );
// 			}
// 			else
// 			{
// 				res.send( 'good' );
// 			}
// 		}
// 	);
// };

exports.view = function(req, res){
	// Project.find({}, function(error, projects){
	// 	res.render("status", {
	// 		title: "RDC Projects",
	// 		projects: projects
	// 	});
	//   });
};

exports.list = function(req, res){
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
	// Election.find({}, function(error, elections){
	// 		res.render("elections", {
	// 			title: "All Elections",
	// 			elections: elections
	// 		});
	//   });
};