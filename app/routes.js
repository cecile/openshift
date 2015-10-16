 // app/routes.js

 	var fs          = require('fs');

	// set up the RESTful API, handler methods are defined in api.js
	//var api = require('./api.js');
	
	module.exports = function(app) {

	    //  Scope.
	    var self = this;

	    /**
	     *  Populate the cache.
	     */
	    self.populateCache = function() {
	        if (typeof self.zcache === "undefined") {
	            self.zcache = { 'index.html': '' };
	        }

	        //  Local cache for static content.
	        self.zcache['index.html'] = fs.readFileSync('./index.html');
	    };


	    /**
	     *  Retrieve entry (content) from cache.
	     *  @param {string} key  Key identifying content to retrieve from cache.
	     */
	    self.cache_get = function(key) { return self.zcache[key]; };

	    // populate the cache
        self.populateCache();

		// server routes ===========================================================
		// handle things like api calls
		// authentication routes
		
		// api routes
/*		app.get('/api/list', api.listItems);
		app.post('/api/list', api.postItem);
		app.delete('/api/list/:id', api.deleteItem);
		app.put('/api/list/:id', api.updateItem);
*/		

		// frontend routes =========================================================
		// route to handle all angular requests
		app.get('*', function(req, res) {
			//res.sendfile('./static/index.html'); // load our public/index.html file

            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );			

		});

	};