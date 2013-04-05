exports.ensure = function(req, res, next) {
	
	if( process.env.DEV_USER != undefined && process.env.DEV_USER != 'none' )
	{
		req.user = {
			token: null,
			netID: process.env.DEV_USER,
			class: 2016,
			school: 'Poly',
			site: 'AD',
			groups: ['admins','nyuad2016','election-creators']
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