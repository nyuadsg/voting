var layout = {
	init: function() {
		$(window).on("resize load", layout.resize);
	},
	resize: function() {
		width = ($(window).width()-$('#header .center').width())/2
		$('#header .left, #header .right').css( "width", width )
	}
}


$(document).ready(function() {
	layout.init();
});