function buildProxy( target, prop, functionDecorator ) {
    
    return function proxy() { 
        
        const originalArguments = arguments;
        const invokeProxiedFunction = () => {

            const proxiedFunction = target[ prop ];    
            return proxiedFunction.apply( target, originalArguments );
            
        };
        return functionDecorator.call( 
            
            target, 
            prop, 
            originalArguments,
            invokeProxiedFunction
        
        );

    }

}

function functionPropertiesOf( target ) {
    
    const props = [];
    for( var prop in target ) { 
        
        if ( typeof target[ prop ] === "function" ) {
            
            props.push( prop );
            
        }
        
    }
    return props;
    
}

module.exports = function decorate( target, functionDecorator ) {
    
    const interceptor = {};
    functionPropertiesOf( target ).forEach( prop => {
        
        interceptor[ prop ] = buildProxy( target, prop, functionDecorator );

    } );
    return interceptor;
    
};
