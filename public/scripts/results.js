var results = {
	init: function() {
		// check delete
		// $('.admin.controls #delete').click( function() {
		// 	
		// 	$('#confirmDelete').show();
		// 	
		// 	return false;
		// });
		
		// charts
		$('ul#results li.race').each( function() {
			$('h2', this).after( '<canvas width="400" height="400"></canvas>');
			ctx = $('canvas', this).get(0).getContext("2d");
			data = new Array;
			$('li.candidate', this).each( function() {
				val = parseInt( $('span', this).text() );
				clr = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
				data.push( {
					value: val,
					color: clr
				} );
				$(this).prepend( '<em class="swatch">&nbsp;</em>');
				$('em', this).css('background-color', clr);
			});
			// '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
			new Chart(ctx).Pie(data,{});
		});
	}
}


$(document).ready(function() {
	results.init();
});