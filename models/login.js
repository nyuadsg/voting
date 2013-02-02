exports.ensure = function(req, res, next) {
	if( req.user == undefined )
	{
		res.redirect(  process.env.base_url + '/auth/start?next=' + encodeURIComponent( process.env.base_url + req.url ) );
	}
	else
	{
		next();
	}
}