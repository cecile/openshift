 // app/routes.js

 	var fs          = require('fs');

	// set up the RESTful API, handler methods are defined in api.js
	var api = require('./api.js');
	
	module.exports = function(app) {

	    //  Scope.
	    var self = this;

	    /**
	     *  Populate the cache.
	     */
	    self.cache = function() {
	        if (typeof self.zcache === "undefined") {
	            self.zcache = { 'index.html': '' };
	        }

	        //  Local cach for static content.cache
	        self.zcache['index.html'] = fs.readFileSync('./static/index.html');
	    };


	    /**
	     *  Retrieve entry (content) from cache.
	     *  @param {string} key  Key identifying content to retrieve from cache.
	     */
	    self.getCache = function(key) { return self.zcache[key]; };

	    // populate the cache
        self.cache();

		// server routes ===========================================================
		// handle things like api calls
		// authentication routes
		
		// api routes
		app.get('/api/list', api.listItems);
		app.post('/api/list', api.postItem);
		app.delete('/api/list/:id', api.deleteItem);
		app.put('/api/list/:id', api.updateItem);
		

		// frontend routes =========================================================
		// route to handle all angular requests
		app.get('*', function(req, res) {
			//res.sendfile('./static/index.html'); // load our public/index.html file

            res.setHeader('Content-Type', 'text/html');
            res.send(self.getCache('index.html') );			

		});

	};