module.exports = function shouldOnlySupportContentTypes( allowedContentTypes ) {
        
    const actualContentType = this.event.headers[ "Content-Type" ];
    if ( !~allowedContentTypes.indexOf( actualContentType ) ) {
        
        console.warn( "Unsupported content type: " + actualContentType );
        const payload = this.payload( 415, "Unsupported content type: " + actualContentType, "text/plain" );
        return Promise.reject( payload );

    }
    
};