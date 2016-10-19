const ldvalidate = require( "ld-validate" );

module.exports = schemas => function shouldHaveSchema( schemaName ) {

    const diagnose = e => console.log( e.stack ) || console.log( "Body:", this.event.body );
    return new Promise( ( resolve, reject ) => {
        
        const validate = ldvalidate( schemas, schemas[ "context" ] );
        validate( schemaName, this.body, e => {
        
            if ( e ) { 
                
                diagnose( e );
                const message = [ "Unprocessable entity", e.message ].join( "\n\n" );
                const payload = this.payload( 422, message, "text/plain" );
                reject( payload );
                
            } else {
                
                resolve();
                
            }
            
        } );

    } );
    
};
