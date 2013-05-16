YUI.add("model-list-tweets", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Tweets;
    
    Tweets = Y.Base.create("tweets", Y.LazyModelList, [
        Y.namespace("Extensions").ModelListMore
    ], {
        sync : function(action, options, done) {
            var self = this,
                args = {};
            
            if(action === "more") {
                if(this.size()) {
                    args.since_id = this.item(0).id_str;
                }
            }
            
            args = Y.merge(
                { count : 50 },
                this.get("config") || {},
                args
            );
            
            tristis.twitter.get(this.get("api"), args, function(err, resp) {
                if(err) {
                    return done(err);
                }
                
                self.loaded = true;
                
                // TODO: ensure we don't add dupe tweets somehow
                done(err, resp);
            });
        },
        
        parse : function(response) {
            return response.map(function(tweet) {
                tweet.html = tristis.txt.autoLinkWithJSON(tweet.text, tweet.entities);
                
                return tweet;
            });
        },
        
        // Sort tweets by date
        comparator : function(model) {
            return Date.parse(model.created_at);
        },
        
        // Sort tweets by newest first
        _compare : function(a, b) {
            return b - a;
        }
    }, {
        ATTRS : {
            api     : null,
            config  : null
        }
    });
    
    models.Tweets = Tweets;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list",
        
        // Extensions
        "extension-model-list-more"
    ]
});
