# client-side-router

A basic hash-based client-side router.
Implements very basic functionality of mapping hash URL to handlers.

Its input is a paths object which maps:
  url => handler

URL parameters are prefixed w ith ':' such as /section/:section_id

## Usage:

You need to pass in a paths object and then initialize the router with the init() method.
```javascript
let router = Router({
	'/' : () => {
		controller_1.init();
	},
	'/sections/': () => {
		controller_1.init();
	},
	'/sections/:section_id': (section_id) => {
		controller_1.init(section_id);
	}
});
router.init();
```

## Operation:
Will parse the paths into regexes and then create one large regex.
The large regex will return the matched paths and the first one to match
is used to. Once a path is matched its handler is called with URL
parameters (if any). 

Order of path matching is not reliably ensured so avoid conflicting paths.


Browser Compatibility (all latest versions):
	IE Edge, Chrome, Firefox, Safari, Chrome for Android, iOS Safari.

## TODO

Development:
- Run thorough tests
- Run performance tests and optimize if needed
- Improved path handlers
- Support user-provided transitions
- Hashbang URLs
- Variadic routes
- Support querystring
- History API (HTML5) support

Build:
- ES5 version
- CommonJS module
- Typescript port

...more to be added!
	
