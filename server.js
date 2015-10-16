#!/bin/env node
//  OpenShift sample Node application
var express     = require('express');
var mongoose    = require('mongoose');


/**
 *  Define the sample application.
 */
var NodeApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

        self.mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
        self.mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
        self.mongoUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
        self.mongoPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

        if ( (typeof self.mongoHost === "undefined") || (typeof self.mongoPort === "undefined" ) ){

            console.error('No MongoDB host configuration, setup OPENSHIFT_MONGODB_DB_HOST & OPENSHIFT_MONGODB_DB_PORT');

            return false;
        }

        if ( (typeof self.mongoUser === "undefined") || (typeof self.mongoPass === "undefined" ) ){

            console.error('No MongoDB user configuration, setup OPENSHIFT_MONGODB_DB_USERNAME & OPENSHIFT_MONGODB_DB_PASSWORD');

            return false;
        }


        self.mongoURL = "mongodb://"+self.mongoUser+":"+self.mongoPass+"@"+self.mongoHost+":"+self.mongoPort+"/"

        return true;
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        
        self.app = express();


        self.app.configure(function() {
            self.app.use(express.static(__dirname + '/static'));     // set the static files location /public/img will be /img for users
            self.app.use(express.logger('dev'));                     // log every request to the console         
            self.app.use(express.bodyParser());                      // have the ability to pull information from html in POST
            self.app.use(express.methodOverride());                  // have the ability to simulate DELETE and PUT
        });        

        //self.createRoutes();
        require('./app/routes')(self.app); // configure our routes

    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {

        if (!self.setupVariables()){
            return false;
        }

        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();

        return true;
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {

        // Connect to MongoDB        
        mongoose.connect(self.mongoURL);
        console.log('%s: MongoDB connected to %s:%d ...',
                    Date(Date.now() ), self.mongoHost,self.mongoPort);

        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var app = new NodeApp();

if( app.initialize() ){

    app.start();    

    exports = module.exports = app; 
}


