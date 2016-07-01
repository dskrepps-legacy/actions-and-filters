
'use strict';

var Actions = require('./actions.js');
var Filters = require('./filters.js');




module.exports = function init(obj) {
	obj = obj || {};
	
	var actions = new Actions();
	obj.action = actions.action.bind(actions);
	
	var filters = new Filters();
	obj.filter = filters.filter.bind(filters);
	
	return obj;
};


