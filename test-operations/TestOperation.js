const BaseOperation = require( "../operations/BaseOperation" );

Array.prototype.except = Array.prototype.except || function( xs ) { return this.filter( y => !~xs.indexOf( y ) ); };

function TestOperation() { }

const describeOutcome = ( outcome, i ) => {
    
    const status = outcome.status, name = outcome.name, args = outcome.args; // destructuriiiiiiiiiiii
    i = ( typeof i === "undefined" ) ? "-" : ( i + 1 );
    console.log( "%s %s %s %s", i, status, name, [].join.call( args, ", " ) );
    
}

TestOperation.prototype = Object.assign( {}, new BaseOperation(), {

    constructor: TestOperation,
    
    execute: function( script ) {

        const base = BaseOperation.prototype.execute;
        this.outcomes = [];
        
        console.log( "Test run begins\n---" );
        this.promise = base.call( this, script ).then( () => {
          
            console.log( "Test run ended" );
            console.log();
            const nonfailures = this.outcomes.filter( x => x.status !== "FAIL" );
            nonfailures.forEach( outcome => describeOutcome( outcome ) );
            console.log();
            const failures = this.outcomes.filter( x => x.status === "FAIL" );
            failures.forEach( ( fail, i ) => {
                
                describeOutcome( fail, i );
                const output = fail.output;
                console.log( output ? output.stack || output : output );
                console.log();
                
            } );
            console.log( "---\n%d tests executed", this.outcomes.length );
            console.log( "Failed: %d. Passed: %d", failures.length, nonfailures.length );
            if ( failures.length ) { 
                
                return Promise.reject( failures.length + " tests failed" );
                
            }

        } );
        return this.promise;
        
    },
    
    startTest: function( name, args ) {
        
        return () => {
            
            console.log( "\n/-- Test: %s\n", name );
            return Promise.resolve();
            
        };

    },
    
    completeTest: function( name, args, isPass ) {
        
        const status = isPass ? "PASS": "FAIL";
        return output => {
            
            return new Promise( process.nextTick ).then( () => {
                
                this.outcomes.push( { name, args, status, output } );
                console.log( "\n\\-- %s: %s %s\n", status, name, isPass ? "" : output );
              
            } );
            
        };
        
    },
    
    callProxy: function( name, args, invoke ) {

        const base = BaseOperation.prototype.callProxy.bind( this );
        const start = this.startTest( name, args );
        const fail = this.completeTest( name, args, false );
        const succeed = this.completeTest( name, args, true );
        
        // promise to label the test
        this.promise = this.promise.then( start );
        // promise to run the test
        base( name, args, invoke );
        // promise to record a pass or fail for the test
        this.promise = this.promise.then( succeed, fail );

    }
    
} );

module.exports = TestOperation;

