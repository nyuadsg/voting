var results = {
	init: function() {
		$('ul#races li.race').each( function() {
			$(this).append( '<canvas width="400" height="400"></canvas>');
			ctx = $('canvas', this).get(0).getContext("2d");
			data = new Array;
			$('li.candidate', this).each( function() {
				val = parseInt( $('span', this).text() );
				clr = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
				data.push( {
					value: val,
					color: clr
				} );
				$(this).append( '<em class="swatch">&nbsp;</em>');
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