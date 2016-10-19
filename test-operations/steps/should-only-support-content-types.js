module.exports = function( supportedContentTypes ) { 
    

    return [ "application/ld+json", "application/json", "text/xml", "application/x-www-form-urlencoded" ]
            .except( supportedContentTypes )
            .map( unsupportedContentType =>
            
                ( { 
            
                    httpMethod: "POST", 
                    headers: { "Content-Type": unsupportedContentType }
                
                } )
                
            )
            .map( evt =>
        
                this.run( evt, null, this.verifyStatusCode( 415, [
                
                    "Should only accept Content Types: " + supportedContentTypes.join( ", " ),
                    "The test sent: " + evt.headers[ "Content-Type" ]
            
                ] ) )
        
            );

};
