module.exports = function() {
    
    return [ "yomomma", "{ \"@context\": \"yomomma\" }" ]
        .map( invalidContent => 
        
            ( {
            
                httpMethod: "POST",
                headers: { "Content-Type": "application/ld+json" },
                body: invalidContent
            
            } )
            
        )
        .map( evt => 
            
            this.run( evt, null, this.verifyStatusCode( 422, [
                    
                "Should parse the body as JSON-LD",
                "The test sent " + evt.body,

            ] ) )
    
        );
    
};
