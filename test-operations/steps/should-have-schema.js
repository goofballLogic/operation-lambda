const glob = require( "glob-promise" );

module.exports = examples => function( schemaName ) {
    
    return glob( examples + "/invalid/" + schemaName + "-*.json" )
        .then( filePaths =>
        
            Promise.all( filePaths
                .map( filePath => require( filePath ) )
                .map( invalidDocument => 
                
                    ( {
                    
                        httpMethod: "POST",
                        headers: { "Content-Type": "application/ld+json" },
                        body: JSON.stringify( invalidDocument, null, 3 )
                
                    } ) 
                
                )
                .map( evt => 
        
                    this.run( evt, null, this.verifyStatusCode( 422, [
                    
                        "Should validate against the schema " + schemaName,
                        "The test sent " + evt.body,
    
                    ] ) )
        
                )
                
            )
        
        );

};
