exports.start = function(req, res){
	if( req.query.next != undefined )
	{
		// set where they should continue onto
		req.session.next = req.query.next;
	}

	// here we redirect to the Passport login
	res.redirect( process.env.BASE_URL + '/auth/passport' );
};

exports.finish = function(req, res){
	// pass people along to their final destination
	if( req.session.next != undefined )
	{
		// send to next, if set
		res.redirect( req.session.next );
	}
	else
	{
		// otherwise, send home
		res.redirect( process.env.BASE_URL );
	}
};