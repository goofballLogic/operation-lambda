const TestOperation = require( "./TestOperation" );
const should = require( "should" );

function paragraph() { return [].reduce.call( arguments, ( ret, a ) => ret.concat( a || [] ), [] ).join( ". " ) + "."; }

function LambdaTestOperation( systemUnderTest ) {
    
    if ( systemUnderTest ) {

        this.handler = systemUnderTest.handler;
        this.ports = systemUnderTest.ports;
        
    }
    
}

LambdaTestOperation.prototype = Object.assign( new TestOperation(), {
    
    constructor: LambdaTestOperation,
    
    // given an event object and context object, 
    run: function run( evt, context, assertion ) {
        
        return new Promise( ( resolve, reject ) => {
        
            function completePromise( assertionError ) {
                
                // did the assertion pass or fail?
                if ( assertionError ) { 

                    reject( assertionError );
                  
                } else {

                    resolve();
                
                }
                          
            }
            
            try {
                
                // invoke the handler
                this.handler( evt, context, ( handlerError, result ) => {

                    try {
                        
                        // pass the results (and error) to the assertion
                        assertion( handlerError, result, completePromise );
                        
                    } catch( synchronousAssertionError ) {
                        
                        // a synchronous error calling the assertion should just reject
                        completePromise( synchronousAssertionError );
                        
                    }
                    
                } );
            
            } catch ( synchronousError ) {
                
                // if we get a synchronous error invoking the handler, pass that to the assertion
                assertion( synchronousError, null, completePromise );
                
            }

        } );
        
    },
    
    verifyStatusCode: function verifyStatusCode( expectedStatusCode, description ) {

        return ( e, result, callback ) => {

            if ( e ) { callback( e ); return; }
            try {
                
                should.exist(
                    
                    result.statusCode,
                    "Status code should exist"
                    
                );
                result.statusCode.should.eql( 
                    
                    expectedStatusCode, 
                    "Expected status " + expectedStatusCode + " but got " + result.statusCode
                    
                );

            } catch( e ) {
                
                callback( new Error( paragraph( e.message, description ) ) );
                return;
                
            }   
            callback();

        };
        
    }
    
} );

module.exports = LambdaTestOperation;
