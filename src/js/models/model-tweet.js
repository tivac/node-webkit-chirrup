YUI.add("model-tweet", function(Y) {
    "use strict";
    
    var falco = Y.namespace("Falco"),
        Tweet;
    
    Tweet = Y.Base.create("tweet", Y.Model, [], {
        // Sync API
        retweet : function(options, done) {
            if(!done && typeof options === "function") {
                done = options;
                options = null;
            }
            
            options || (options = {});
            
            this.sync("retweet", options, done);
        },
        
        // Sync implementation
        sync : function(action, options, done) {
            if(!Tweet.ACTIONS[action]) {
                return done("Unknown action");
            }
            
            this["_sync" + Tweet.ACTIONS[action]](options, done);
        },
        
        _syncRetweet : function(options, done) {
            falco.twitter.post("statuses/retweet/" + this.get("id_str"), done);
        }
    }, {
        ATTRS : {
        },
        
        ACTIONS : {
            retweet : "Retweet"
        }
    });
    
    Y.namespace("Falco.Models").Tweet = Tweet;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model"
    ]
});
