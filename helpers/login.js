exports.ensure = function(req, res, next) {
	
	if( process.env.DEV_USER != undefined )
	{
		req.user = {
			token: null,
			netID: process.env.DEV_USER,
			class: 2016
		};
	}
	
	if( req.user == undefined )
	{
		res.redirect(  process.env.BASE_URL + '/auth/start?next=' + encodeURIComponent( process.env.BASE_URL + req.url ) );
	}
	else
	{
		next();
	}
}