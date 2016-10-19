module.exports = function testOperation( opts ) {

    // script to test
    const script = opts.script;
    if ( !script ) { throw new Error( "Missing script" ); }
    
    // testing operation
    const Op = opts.TestOperation;
    if ( !Op ) { throw new Error( "Missing TestOperation" ); }
    
    // thing to test
    const systemUnderTest = opts.systemUnderTest;
    if ( !systemUnderTest ) { throw new Error( "Missing systemUnderTest" ); }
    
    // how to fail the test run
    const bail = up => (
        
        ur => codez => suck => { throw up; }
        
    )()()()()()()()()()()()()()();
    
    // outcomes
    const pass = () => { console.log( "PASS" ); clearTimeout( pending ); };
    const fail = e => process.nextTick( () => bail( e ) );
    const timeout = () => { throw new Error( "Timed out" ); }
    
    // fire it up
    new Op( systemUnderTest )
        .execute( script )
        .then( pass, fail );
    
    // start the timeout
    const pending = setTimeout( timeout, 5000 );

};
