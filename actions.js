
'use strict';

module.exports = Actions;



function Actions() {
	this.allActions = {};
	this.usedIds = {
		before: {},
		here: {},
		after: {},
	};
	this._where = 'here'; // Used to determine before and after
	
	this.action.before = this.before.bind(this);
	this.action.after = this.after.bind(this);
}


Actions.prototype.before = function before(/*...args*/){
	this._where='before';
	this.action.apply(this, arguments);
};

Actions.prototype.after = function after(/*...args*/){
	this._where='after';
	this.action.apply(this, arguments);
};


// id is optional. If name is the only argument run the action.
Actions.prototype.action = function action(name, id, content) {
	
	// When using as a template helper extra objects might be passed
	if (typeof id === 'object') {
		id = undefined;
		delete arguments[1];
		arguments.length -= 1;
	}
	if (typeof content === 'object') {
		content = undefined;
		delete arguments[1];
		arguments.length -= 1;
	}
	
	if (typeof name !== 'string') {
		throw new TypeError('Action\'s name must be string');
	}
	
	if(arguments.length === 1) {
		return this.doAction(name);
	}
	
	if(arguments.length === 2) {
		content = id;
		id = undefined;
	}
	 
	if (typeof id !== 'undefined') {
		if (typeof id !== 'string') {
			throw new TypeError('Action id must be string');
		}
		
		// Ignore this call if the ID is already used
		if (this.usedIds[this._where][id]) {
			return;
		}
		
		this.usedIds[this._where][id] = true;
	}
	
	
	this.allActions[name] = this.allActions[name] || {
		before: [],
		here: [],
		after: [],
	};
	
	// Save the action
	this.allActions[name][this._where].push(content);
	this._where = 'here'; // Reset 
	
};


Actions.prototype.doAction = function doAction(name) {
	
	if (!this.allActions[name]) return '';
	
	var output = '';
	
	output += this.allActions[name].before.reduce(catFuncOrStr, '');
	output += this.allActions[name].here.reduce(catFuncOrStr, '');
	output += this.allActions[name].after.reduce(catFuncOrStr, '');
	
	return output;
};





function catFuncOrStr(prev, val) {
	
	if (typeof val === 'function') {
		val = val();
	}
	
	if (typeof val === 'undefined' || val === null) {
		val = '';
	}
	
	return prev + val;
}