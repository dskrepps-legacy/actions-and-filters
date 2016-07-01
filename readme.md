# JS Actions & Filters

[![npm](https://img.shields.io/npm/v/actions-and-filters.svg)](https://www.npmjs.com/package/actions-and-filters)
[![npm](https://img.shields.io/npm/dm/actions-and-filters.svg)](https://www.npmjs.com/package/actions-and-filters)
[![npm](https://img.shields.io/npm/l/actions-and-filters.svg)](./LICENSE)

Simple actions and filters inspired by Wordpress' similar methods.

```js
var obj = require('actions-and-filters')();

// For actions, register a string to be returned:
obj.action('styles', '<link rel="stylesheet" href="theme.css" />');
// or a function to be called:
obj.action('styles', ()=>'<link rel="stylesheet" href="'+otherPath()+'" />');

var stylesHtml = obj.action('styles');
//<link rel="stylesheet" href="theme.css" /><link rel="stylesheet" href="..." />
```

```js
// For filters register functions to be passed a string:
obj.filter('content', (str)=>str.replace('foo', 'Hello'));
obj.filter('content', (str)=>str.replace('bar', 'world!'));

var result = obj.filter('content', 'foo bar');
// Hello world!
```

You can give both actions or filters an ID which will prevent other calls to the same name-ID combination from doing anything at all. Use it to prevent seperate modules from loading the same thing:

```js
// Within Module A that needs jquery:
obj.action('scripts', 'jquery', '<script src="jquery.js"></script>');
// Within Module B that needs jquery:
obj.action('scripts', 'jquery', '<script src="jquery.js"></script>');
// The second call is ignored if A is present, yet B will still work without A. 

var result = obj.action('script');
// <script src="jquery.js"></script>
```

Both actions and filters are called in the order they were defined. While there is no 'priority' parameter like WordPress's action/filter API there are before and after methods:

```js
obj.filter('content', 'remove foobar', (str)=str.replace('foobar', ''));
obj.filter.before('content', 'double foo', (str)=str.replace('foo', 'foofoo'));

var result = obj.filter('content', 'foobar');
// 'foo' even though foobar was removed, foo was doubled first
```

Methods are bound to their instance so you can pass them along as functions. Example Express/Handlebars server extending `app`:

```js
var app = require('express')();
var ehbs  = require('express-handlebars');

require('actions-and-filters')(app); // You can extend an object like so

app.action('scripts', '<script src="myscript.js"></script');

// Register app.action as a helper
var hbs = ehbs.create({helpers: {action: app.action}});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes, middleware, listen, etc

// Call from within a handlebars view: {{action 'scripts'}}
```

You can also include the constructors directly if you want:

```js
var Actions = require('actions-and-filters/actions');
myActions = new Actions();
myActions.action(...);
```


### API

#### `var obj = require('actions-and-filters')(extendObj)`
`obj` will be an object with only the methods `.action` and `.filter` while optionally `extendObj` will be given those methods.

#### `obj.action(name[, id], content)`

`name` must be a string which names the action to be called later. Optionally `id` if present will prevent any later content from being added to that action with the same ID. `content` can be a string or a function.

#### `obj.action(name)`

Calling only a name will, in the order they were added, get the result of calling any functions given and concatenate those results with any strings given. Contents which are not functions or strings are coerced to strings, unless a function's result is `undefined` or `null` in which case the function is ignored.

#### `obj.action.before(...)` and `obj.action.after(...)`

Exact same API as above but will be called before and after other contents. Providing an ID has no relationship to an ID used in the non-before/non-after action.

#### `obj.filter(name[, id], filterFunction)`

`name` must be a string which names the filter to be called later. Optionally `id` if present will prevent any later filters from being run with the same ID. `filterFunction` must be a function and will be passed a string to filter.

#### `obj.filter(name, stringToFilter)`

In the order `filterFunction`s were added, pass `strToFilters` to the first, then the result to the second, et cetera, returning the eventual final result.

#### `obj.filter.before(...)` and `obj.filter.after(...)`

Exact same API as above but will be called before and after other filters. Providing an ID has no relationship to an ID used in the non-before/non-after action.


### License

MIT