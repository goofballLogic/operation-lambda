module.exports = function( allowedMethods ) {
    
    return [ "GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "YOMOMMA" ]
            .except( allowedMethods )
            .map( httpMethod => ( { httpMethod } ) )
            .map( evt =>
        
                this.run( evt, null, this.verifyStatusCode( 405, [
                
                    "Should only accept HTTP methods: " + allowedMethods.join( ", " ),
                    "The test sent a " + evt.httpMethod
        
                ] ) )
                
            );
            
};
