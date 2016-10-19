const jsonld = require( "jsonld" );

module.exports = function shouldParseBodyAsJSONLD() {
        
    return new Promise( ( resolve, reject ) => {

        const diagnose = e => console.log( e.stack ) || console.log( "Body:", this.event.body );
        var payload;
        try {
        
            payload = JSON.parse( this.event.body );
            jsonld.expand( payload, ( e, expanded ) => {
        
                if ( e ) { 
                    
                    diagnose( e );
                    reject( this.payload( 422, "Unprocessable entity", "text/plain" ) );

                } else {
                    
                    this.body = expanded;
                    resolve();
                    
                }
            
            } );

        } catch ( e ) {

            diagnose( e );
            reject( this.payload( 422, "Unprocessable entity", "text/plain" ) );
            
        }
        
    } );
    
};
