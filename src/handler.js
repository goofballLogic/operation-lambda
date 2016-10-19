    

    
module.exports = opts => {
    
    // ensure configuration is loaded in
    const config = opts.config;
    const configPromise = opts.configPromise;
    if ( !( config || configPromise ) ) { throw new Error( "Missing config or configPromise" ); }
    const ensureConfiguration = config ? Promise.resolve( config ) : configPromise;

    // script to execute
    const script = opts.script;
    if ( !script ) { throw new Error( "Missing script" ); }
    
    // a storage operation
    const Op = opts.Operation;
    if ( !Op ) { throw new Error( "Missing Operation" ); }
    
    // ports to external resources (e.g. db)
    const ports = opts.ports;
    if ( !ports ) { throw new Error( "Missing ports" ); }
    
    return function handler( event, context, callback ) {

        const op = new Op( { ports, event, context, config } );
        const completion = payload => ports.send( payload, callback );
        ensureConfiguration
            .then( () => op.execute( script )  )
            .then( completion, completion );
            
    };

};
