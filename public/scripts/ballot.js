var ballot = {
	init: function() {
		this.ballot = $('.ballot');
		this.races = $('.race', this.ballot);
		this.candidates = $('.candidate', this.ballot);
		this.netID= $('input#netID', this.ballot);
		this.vote = $('#vote')
		
		$('input', this.candidates ).change( function( ev ) {
			$(this).parents('.candidate').toggleClass('selected');
		});
		
		if( this.netID.length > 0 )
		{
			ballot.admin();
		}
		
		// this.votes = new Object;
		
		// $('a', this.candidates).click( function( event ) {
		// 	candidate = $(this).parents('.candidate').first();
		// 	race = candidate.parents('.race')
		// 	candidate.siblings().removeClass('selected');
		// 	candidate.addClass('selected');
		// 	
		// 	ballot.voteFor( race.attr('id'), candidate.attr('id') );			
		// 	return false;
		// });
		// 
		// $('input#submit', this.ballot).click( function( event ) {
		// 	ballot.submit();
		// 	return false;
		// });
	},
	admin: function() {
		$('input#RFID').css('margin-left', '-300000px');
		$('input#netID').focus();
		
	}
	// voteFor: function( race, candidate ) {
	// 	this.votes[ '"' + race + '"' ] = candidate;
	// },
	// submit: function() {
	// 	$.post(window.location, {
	// 			netID: this.netID.val(),
	// 			election: this.ballot.attr('id'),
	// 			votes: JSON.stringify(this.votes)
	// 		},
	// 		function( response) {
	// 			
	// 		}
	// 	);
	// }
}

$(document).ready(function() {
	ballot.init();
});