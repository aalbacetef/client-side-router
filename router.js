/*
	Author: Arturo Albacete

	A basic hashbang-based client-side router.

	Implements very basic functionality of mapping hashbang URL to handlers.

	Its input is a paths object mapping:
		url => handler

	URL parameters are prefixed with :

	An example paths object:

	let paths = {
		'/' : () => {
			controller_1.init();
		},
		'/sections/': () => {
			controller_1.init();
		},
		'/sections/:section_id': (section_id) => {
			controller_1.init(section_id);
		}
	}

	Usage:

		let router = Router(paths);
		router.init();


	Operation:
		Will parse the paths into regexes and then create one large regex.
		The large regex will return the matched paths and the first one to match
		is used to.
		Order of path matching is not reliably ensured so avoid conflicting paths.


	Browser Compatibility:
		(all latest versions)
		IE Edge, Chrome, Firefox, Safari, Chrome for Android, iOS Safari .

*/

function Router(paths) {
	if( typeof paths === 'undefined') {
		return false;
	}

	return {
		paths: paths,
		dispatcher: null,
		search: null,
		search_routines: null,

		init() {
			//build regexes
			this.load_routes();

			window.addEventListener(
				'hashchange',
				event => this.parse_url(event.newURL),
				false
			);
			return this;
		},
		parse_url(url) {

			if( url.indexOf('#') === -1) {
				return false;
			}

			let url_fragments = url.split('#');
			if( url_fragments.length !== 2) {
				return false;
			}

			let hash_url = url_fragments[1];
			let re = new RegExp(this.search, 'i');

			let match = re.exec(hash_url);
			if( match === null ) {
				return false;
			}

			let matched_str = match.shift();
			let matched_index = match
				.map( (elem, indx) => {
					if( typeof elem !== 'undefined' ) {
						return indx;
					} else {
						return '';
					}
				})
				.filter( elem => {
					return elem !== '';
				})[0];

			let route_path = this.dispatcher[matched_index];
			let route_regex = new RegExp( this.search_routines[matched_index], 'gi');
			match = route_regex.exec( hash_url );

			if( match === null ) {
				return false;
			}

			let handler = this.paths[route_path];
			let params = match.slice(1);

			return handler.apply( this, params);
		},
		load_routes() {
			let route_paths = Object.keys(this.paths);
			this.dispatcher = route_paths;
			this.search_routines = route_paths
				.map( route_path => {

					if( route_path === '/') {
						return '^\/$';
					}

					// break route up into fragments
					// and produce regex for that fragment
					let regex = route_path
						.split('/')
						.filter( fragment => fragment !== '')
						.map( fragment => {
							let re;

							if( fragment.startsWith(':') ) {
								re = '([0-9a-z_]+)';
							} else {
								re = fragment;
							}
							re = '\/'+re;
							return re;
						})
						.join('');
					// add start and end of line anchors
					// add trailing slash
					regex = '^' + regex + '\/?$';
					return regex;
				});

			this.search = this.search_routines
				.map( elem => elem.replace(/\(|\)/gi, '') )
				.join(')|(');

			this.search = '('+ this.search + ')';
			return true;
		}
	}
}
