#!/usr/bin/env node

/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var resolve = require( 'path' ).resolve;
var logger = require( 'debug' );
var writeFile = require( '@stdlib/fs-write-file' ).sync;
var namespace = require( '@stdlib/namespace' );
var objectKeys = require( '@stdlib/utils-keys' );
var replace = require( '@stdlib/string-replace' );


// VARIABLES //

var debug = logger( 'namespace:alias2standalone:build' );

// Output file paths:
var OUTPUT_JSON = resolve( __dirname, '..', 'data', 'data.json' );
var OUTPUT_CSV = resolve( __dirname, '..', 'data', 'data.csv' );


// FUNCTIONS //

/**
* Converts an internal package name to a standalone package name.
*
* @private
* @param {string} name - internal package name
* @returns {string} standalone package name
*/
function pkg2standalone( name ) {
	// Note: every internal package name begins with `@stdlib/`, which is 8 characters long...
	return '@stdlib/' + replace( name.substring( 8 ), '-', '-' );
}

/**
* Main execution sequence.
*
* @private
*/
function main() {
	var fopts;
	var keys;
	var json;
	var csv;
	var ns;
	var i;

	debug( 'Mapping namespace aliases to standalone package names...' );
	ns = namespace();
	json = {};
	for ( i = 0; i < ns.length; i++ ) {
		json[ ns[i].alias ] = pkg2standalone( ns[ i ].path );
	}

	debug( 'Writing to JSON file...' );
	fopts = {
		'encoding': 'utf8'
	};
	writeFile( OUTPUT_JSON, JSON.stringify( json )+'\n', fopts );

	debug( 'Writing to CSV file...' );
	fopts = {
		'encoding': 'utf8'
	};
	keys = objectKeys( json );
	csv = '';
	for ( i = 0; i < keys.length; i++ ) {
		csv += keys[ i ] + ',"' + json[ keys[i] ] + '"\n'; // Note: ensures trailing newline
	}
	writeFile( OUTPUT_CSV, csv, fopts );
}


// MAIN //

main();
