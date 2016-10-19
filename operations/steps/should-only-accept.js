module.exports = function shouldOnlyAccept( allowedMethods ) {
        
    const actualMethod = this.event.httpMethod;
    if ( !~allowedMethods.indexOf( actualMethod ) ) {
        
        const payload = this.payload( 405, "Method not allowed: " + actualMethod, "text/plain" );
        return Promise.reject( payload );

    }

};
