/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor
		Copyright (c) 2014 Regynald Reiner Ventura

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "parse-query-condition",
			"fileName": "parse-query-condition.js",
			"moduleName": "parseQueryCondition",
			"authorName": "Richeve Siodina Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"contributorList": [
				{
					"contributorName": "Regynald Reiner Ventura",
					"contributorEMail": "regynaldventura@gmail.com"
				}
			],
			"repository": "git@github.com:volkovasystems/parse-query-condtion.git",
			"testCase": "start-socket-server-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:
		Query conditions has the following format:

			reference@key=value|!keyA|keyB

		Where reference is any identification of scope where the series of query belongs.
		
		The key can have a value or it cannot have a value denoting a true flag variable.

		Key preceeded by exclamation point is a false flag variable.

		Query condition will be transformed into an object with the following structure:

			{
				"reference": "<reference>",
				"queryObject": {
					"<key>": "<value>",
					"<keyA>": false,
					"<keyB>": true
				}
			}

	@end-module-documentation

	@include:
	@end-include
*/
var parseQueryCondition = function parseQueryCondition( condition, defaultReference ){
	/*:
		@meta-configuration:
			{
				"condition:required": "string",
				"defaultReference:optional": "string"
			}
		@end-meta-configuration
	*/

	var conditionList = condition.split( "@" );
	var reference = conditionList[ 0 ];

	if( reference != condition ){
		condition = conditionList[ 1 ];

	}else{
		reference = defaultReference || undefined;
	}

	var queryCondition = {
		"reference": reference,
		"queryObject": { }
	};

	conditionList = condition.split( "\|" );
	
	var keyValueList = null;
	var keyValue = "";
	var queryKey = "";
	var conditionValue = "";

	var conditionListLength = conditionList.length;
	for( var index = 0; index < conditionListLength; index++ ){
		
		keyValue = conditionList[ index ];
		keyValueList = keyValue.split( "=" );

		if( keyValueList.length >= 1 ){
			queryKey = keyValueList[ 0 ];

		}else{
			var error = new Error( "invalid query key" );
			console.error( error );
			throw error;
		}

		if( keyValueList.length == 2 ){
			conditionValue = keyValueList[ 1 ];

		}else if( keyValueList.length == 1 ){
			conditionValue = !BOOLEAN_QUERY_KEY_PATTERN.test( queryKey );
			queryKey = queryKey.replace( BOOLEAN_QUERY_KEY_PATTERN, "" );

		}else{
			var error = new Error( "invalid condition value" );
			console.error( error );
			throw error;
		}
		
		queryCondition.queryObject[ queryKey ] = conditionValue; 
	}

	return queryCondition;
};

const BOOLEAN_QUERY_KEY_PATTERN = /^!/;

module.exports = parseQueryCondition;