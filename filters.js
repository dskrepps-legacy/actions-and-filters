
'use strict';

module.exports = Filters;



function Filters() {
	this.allFilters = {};
	this.usedIds = {
		before: {},
		here: {},
		after: {},
	};
	this._where = 'here'; // Used to determine before and after
	
	this.filter.before = this.before.bind(this);
	this.filter.after = this.after.bind(this);
}


Filters.prototype.before = function before(/*...args*/){
	this._where='before';
	this.filter.apply(this, arguments);
};

Filters.prototype.after = function after(/*...args*/){
	this._where='after';
	this.filter.apply(this, arguments);
};


// id is optional but if filterFunc is missing
// then id is a string to run through the filter.
Filters.prototype.filter = function filter(name, id, filterFunc) {
	
	// When using as a template helper extra objects might be passed
	if (typeof id === 'object') {
		id = undefined;
		arguments.length -= 1;
	}
	if (typeof filterFunc === 'object') {
		filterFunc = undefined;
		arguments.length -= 1;
	}
	
	if (typeof name !== 'string') {
		throw new TypeError('Filter name must be string');
	}
	
	if(arguments.length === 2) {
		if (typeof id === 'function') {
			filterFunc = id;
			id = undefined;
		} else {
			var strToFilter = id;
			return this.doFilter(name, strToFilter);
		}
	}
	 
	if (typeof id !== 'undefined') {
		if (typeof id !== 'string') {
			throw new TypeError('Filter id must be string');
		}
		
		// Ignore this call if the ID is already used
		if (this.usedIds[this._where][id]) {
			return;
		}
		
		this.usedIds[this._where][id] = true;
	}
	
	if (typeof filterFunc !== 'function') {
		throw new TypeError('Filter must be function');
	}
	
	
	this.allFilters[name] = this.allFilters[name] || {
		before: [],
		here: [],
		after: [],
	};
	
	// Save the filter
	this.allFilters[name][this._where].push(filterFunc);
	this._where = 'here'; // Reset
	
};


Filters.prototype.doFilter = function doFilter(name, strToFilter) {
	
	strToFilter += '';
	
	if (!this.allFilters[name]) return strToFilter;
	
	var output = strToFilter;
	
	var filters = this.allFilters[name];
	var filter = (prev, val)=>val(prev);
	
	output = filters.before.reduce(filter, output);
	output = filters.here.reduce(filter, output);
	output = filters.after.reduce(filter, output);
	
	return output;
};