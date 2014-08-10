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

	conditionList = condition.split( "=" );
	var queryKey = conditionList[ 0 ];
	
	if( queryKey == condition ){
		var error = new Error( "invalid query key" );
		console.error( error );
		callback( error );

	}else{
		condition = conditionList[ 1 ];
	}

	if( !condition ){
		var error = new Error( "invalid condition value" );
		console.error( error );
		callback( error );
	}

	var conditionValue = condition;

	var queryCondition = {
		"reference": reference,
		"queryObject": { }	
	};

	queryCondition.queryObject[ queryKey ] = conditionValue

	return queryCondition;
};

module.exports = parseQueryCondition;