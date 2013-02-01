var Ballot = Backbone.Model.extend({});

window.BallotView = Backbone.View.extend( {
	el: '#ballot',
	initialize: function () {
		_.bindAll(this, 'changeName');

	  this.model.bind('change:name', this.changeName);
	
    this.template = _.template($('#ballot').html());
    this.render(); 
	},
	render: function () {
	    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
	    return this;
	},
	changeName: function () {
		this.$('h1').text(this.model.get('name'));
	},
	events: {
      'click h1': 'handleTitleClick'
  },
  handleTitleClick: function () {
		this.model.set('name', 'bob');
	}
});


$(function () {
	ballot = new Ballot();

	ballot.set({
	    name: "The Matrix"
	});

	ballot.get('name');
	
  window.ballotView = new BallotView({model: ballot});
});