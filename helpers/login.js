exports.ensure = function(req, res, next) {
	if( req.user == undefined )
	{
		res.redirect(  process.env.BASE_URL + '/auth/start?next=' + encodeURIComponent( process.env.BASE_URL + req.url ) );
	}
	else
	{
		next();
	}
}