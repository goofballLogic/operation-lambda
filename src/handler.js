module.exports = opts => {
    
    // ensure configuration is loaded in
    const config = opts.config;
    if ( !config ) { throw new Error( "Missing config" ); }
    
    // optionally allow promise of configuration    
    const configPromise = opts.configPromise;
    const ensureConfiguration = configPromise || Promise.resolve();

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
        const callbackWrapper = ( e, payload ) => config.teardown( () => callback( e, payload ) );
        const completion = payload => ports.send( payload, callbackWrapper );
        
        ensureConfiguration
            .then( () => op.execute( script )  )
            .then( completion, completion );
            
    };

};
