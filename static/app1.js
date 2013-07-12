
var Tweet = Backbone.Model.extend({});

var TweetLibrary = Backbone.Collection.extend({
    model:Tweet
});


var library = new TweetLibrary();

var tweet1 = new Tweet({
    text:"Hi"
})

library.add(tweet1);


var TweetView = Backbone.View.extend({
    initialize:function(args){
        
    },
    
    events:{
        
    },
    
    render:function(){
        
    },
    
    changeTitle:function(){
        
    }
    
});


var TweetAppController = {
    
    init:function(spec){
        
        this.config = {
            connect:true
        };
        
        _.extend(this.config, spec);
        
        this.model = new TweetAppModel({
            
        });
        
        this.view = new TweetApppView({model:this.model});
        
    }
    
    
    
};