module.exports = opts => {
    
    // ensure configuration is loaded in
    const maybeConfigPromise = opts.config;
    if ( !maybeConfigPromise ) { throw new Error( "Missing config" ); }
    const configPromise = maybeConfigPromise instanceof Promise 
        ? maybeConfigPromise 
        : Promise.resolve( maybeConfigPromise );

    // script to execute
    const script = opts.script;
    if ( !script ) { throw new Error( "Missing script" ); }
    
    // a storage operation
    const Op = opts.Operation;
    if ( !Op ) { throw new Error( "Missing Operation" ); }
    
    // ports to external resources (e.g. db)
    const ports = opts.ports;
    if ( !ports ) { throw new Error( "Missing ports" ); }

    // the completion to send the result
    const buildCompletion = ( config, callback ) => {

        const justInvoke = f => f();
        const maybeTeardown = config.teardown || justInvoke;
        const maybeTeardownThenCallback = ( e, x ) => maybeTeardown( () => callback( e, x ) );
        return payload => ports.send( payload, maybeTeardownThenCallback );
        
    };
    
    return function handler( event, context, callback ) {
        
        configPromise.then( config => {
            
            const completion = buildCompletion( config, callback );
            new Op( { ports, event, context, config } )
                .execute( script )
                .then( completion, completion );
                
        }, callback );

    };

};
