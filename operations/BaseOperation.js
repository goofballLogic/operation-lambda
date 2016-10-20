const decorate = require( "../src/decorate" );
const debug = require( "debug" );

function BaseOperation() { }

/*
    The call proxy is a chance in wrap the act of adding a promise to call the named function with the specified arguments
    For example, you could log the functions being called, or you could chain an additional .then or .catch after each
    promised invokation.
*/
BaseOperation.prototype.callProxy = function( name, args, invoke )  {
    
    this.promise = this.promise.then( () => {

        const invoked = invoke();
        if ( Array.isArray( invoked ) ) {
            
            return Promise.all( invoked );
            
        } else {
            
            return invoked;
            
        }

    } );
    
};

/*
    Calling execute with a script will cause a proxied copy of this operation to be passed to the script.
    If you wish to mess with the invokation of each script step, you can override the `callProxy` function.
    Cause you know you want to.
*/
BaseOperation.prototype.execute = function( script ) {

    this.promise = this.promise || Promise.resolve();
    const interceptor = decorate( this, ( name, args, invoke ) => {
  
        const now = Date.now();
        this.callProxy( name, args, invoke );
        debug( "operation-lambda" )( name + ": " + ( Date.now() - now ) );
        return interceptor;
        
    } );
    script( interceptor );
    return this.promise;
    
};

module.exports = BaseOperation;
