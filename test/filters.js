

var test = require('tape');
var Filters = require('../filters.js');

test('simple filter', function(t) {
	
	var a = new Filters();
	
	a.filter('test', (str)=>str.replace('foo', 'Hello'));
	a.filter('test', (str)=>str.replace('bar', 'world!'));
	
	var result = a.filter('test', 'foo bar');
	
	t.equal(result, 'Hello world!');
	t.end();
});

test('filter with before and after', function(t) {
	
	var a = new Filters();
	
	a.filter('test', (str)=>str.replace('bar', 'baz'));
	a.filter.after('test', (str)=>str.replace('baz', 'qux'));
	a.filter.before('test', (str)=>str.replace('foo', 'bar'));
	
	var result = a.filter('test', 'foo');
	
	t.equal(result, 'qux');
	t.end();
});

test('id\'d filters are unique', function(t) {
	
	var a = new Filters();
	
	a.filter('test', 'double bar', (str)=>str.replace('bar', 'barbar'));
	a.filter('test', 'double bar', (str)=>str.replace('bar', 'barbar'));
	
	var result = a.filter('test', 'bar');
	
	t.equal(result, 'barbar');
	t.end();
});

test('call with no filters returns original string', function(t) {
	
	var a = new Filters();
	
	var result = a.filter('test', 'foobar');
	
	t.equal(result, 'foobar');
	t.end();
});

test('multiple complex filters', function(t) {
	
	var a = new Filters();
	
	a.filter.after('test', 'double bar', (str)=>str.replace('bar', 'barbar'));
	a.filter.after('test', 'double bar', (str)=>str.replace('bar', 'barbar'));
	a.filter.before('test', 'add bar', (str)=>str.replace('foo', 'foobar'));
	a.filter.before('test', 'do nothing', (str)=>str);
	
	a.filter.after('test2', (str)=>str.replace('bazbazbaz', 'bazbaz'));
	a.filter('test2', (str)=>str.replace('qux', ''));
	a.filter('test2', (str)=>str.replace('bar', 'foobar'));
	a.filter('test2', (str)=>str.replace('bar', 'baz'));
	a.filter.before('test2', (str)=>str.replace('bar', 'barbaz'));
	
	
	var result1 = a.filter('test', 'foobaz');
	t.equal(result1, 'foobarbarbaz');
	
	var result2 = a.filter('test2', 'foobarbazqux');
	t.equal(result2, 'foofoobazbaz');
	
	t.end();
});