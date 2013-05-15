YUI.add("extension-tristis-events", function(Y) {
    "use strict";
    
    var gui = require("nw.gui"),
    
        models  = Y.namespace("Tristis.Models"),
        streams = Y.namespace("Tristis.Streams"),
        
        Events;
    
    Events = function() {};
    Events.prototype = {
        events : {
            "[data-external]" : {
                click : "_eventExternalClick"
            }
        },
        
        initializer : function() {
            this._handles = [
                this.on({
                    "*:linked" : this._linkedEvent,
                    "*:url"    : this._urlEvent
                }, null, this)
            ];
            
            // Have to adjust this based on main app startup flow
            if(models.timelines) {
                this._eventsSetup();
            } else {
                Y.Do.after(this._eventsSetup, this, "_setup", this);
            }
        },
        
        // Called after main app's _setup fn
        _eventsSetup : function() {
            this._handles.push(
                models.timelines.on("updated", this._updatedEvent, this),
                streams.user.on("friends", this._friendsEvent, this)
            );
        },
        
        // DOM events
        _eventExternalClick : function(e) {
            e.preventDefault();
            
            gui.Shell.openExternal(e.currentTarget.get("href"));
        },
        
        // YUI events
        
        // TODO: more?
        _linkedEvent : function() {
            this._setup();
        },
        
        _urlEvent : function(e) {
            this.navigate(e.url);
        },
        
        _updatedEvent : function(e) {
            this.get("children").nav.updated({ id : e.src, count : e.count });
        },
        
        _friendsEvent : function(friends) {
            models.friends = new models.Friends({
                items : friends
            });
        }
    };
    
    Y.namespace("Tristis.Extensions").Events = Events;
    
}, "@VERSION@", {
    requires : [
        "stream-user",
        "model-list-friends"
    ]
});
