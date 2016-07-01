

var test = require('tape');
var Actions = require('../actions.js');

test('simple action', function(t) {
	
	var a = new Actions();
	
	a.action('test', 'foo');
	a.action('test', 'bar');
	
	var result = a.action('test');
	
	t.equal(result, 'foobar');
	t.end();
});

test('action with before and after', function(t) {
	
	var a = new Actions();
	
	a.action('test', 'bar');
	a.action.after('test', 'baz');
	a.action.before('test', 'foo');
	
	var result = a.action('test');
	
	t.equal(result, 'foobarbaz');
	t.end();
});

test('function contents', function(t) {
	
	var a = new Actions();
	
	a.action('test', ()=>'bar');
	a.action.after('test', ()=>'baz');
	a.action.before('test', ()=>'foo');
	
	var result = a.action('test');
	
	t.equal(result, 'foobarbaz');
	t.end();
});

test('id\'d contents are unique', function(t) {
	
	var a = new Actions();
	
	a.action('test', 'id', 'bar');
	a.action('test', 'id', 'baz');
	a.action.before('test', 'foo');
	
	var result = a.action('test');
	
	t.equal(result, 'foobar');
	t.end();
});

test('multiple complex actions', function(t) {
	
	var a = new Actions();
	
	a.action.before('test', 'id', 'foo');
	a.action('test', ()=>'bar');
	a.action('test', 'bar');
	a.action.after('test', 'baz');
	a.action.before('test', 'id', ()=>'fido');
	
	a.action.before('test2', 'foo');
	a.action('test2', 'a', ()=>'bar');
	a.action('test2', 'a', 'bar');
	a.action('test2', 'b', 'baz');
	a.action.after('test2', 'baz');
	a.action.before('test2', ()=>'foo');
	
	var result1 = a.action('test');
	t.equal(result1, 'foobarbarbaz');
	
	var result2 = a.action('test2');
	t.equal(result2, 'foofoobarbazbaz');
	
	t.end();
});