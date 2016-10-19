const BaseOperation = require( "./BaseOperation" );
function LambdaOperation( options, callback ) {
    
    if ( options ) {
        
        this.event = options.event;
        this.context = options.context;
        this.ports = options.ports;
        this.config = options.config;
    
    }

}
LambdaOperation.prototype = Object.assign( new BaseOperation(), {
    
    constructor: LambdaOperation,
    
    payload: function( statusCode, body, contentTypeOrHeaders ) {

        if ( typeof contentTypeOrHeaders !== "object" ) {
            
            contentTypeOrHeaders = { "Content-Type": contentTypeOrHeaders };
            
        }
        return { statusCode, body, headers: contentTypeOrHeaders };
        
    }

} );

module.exports = LambdaOperation;
