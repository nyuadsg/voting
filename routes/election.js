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
		res.render("index", {
			title: "All Elections",
			elections: elections
		});
  });
};