// to generate error numbers
const shortid = require( "shortid" );
function send( payload, callback ) {

    try {

        if ( payload instanceof Error ) { throw payload; }
        if ( !payload ) { throw new Error( "No response object" ); }
        if ( !payload.headers ) { throw new Error( "No headers included in response: " + JSON.stringify( payload ) ); }
        if ( !payload.statusCode ) { throw new Error( "No status code included in response: " + JSON.stringify( payload ) ); }
        if ( payload.body && ( typeof payload.body !== "string" ) ) { throw new Error( "Body is not a string" + payload ); }
        callback( null, payload );
        
    } catch( e ) {
        
        const errNum = shortid.generate();
        console.log( "[ ERROR", errNum, "]", e.stack );
        callback( null, { 
            
            "headers": { "Content-Type": "text/plain" },
            "statusCode": 500, 
            "body": "An error occurred processing the request. [ Error code: " + errNum + " ]"
            
        } );
        
    }

}
module.exports = send;
