(function ($) {
    var tweets =[];
    var users=[];
    var domains=[];
    
    var loadfirst=true;
    
    var Tweet = Backbone.Model.extend({
      defaults:{
          coverImage:"",
          text:"",
          user:"",
          time:"",
          tweet_id:"",
          source_url:"",
      }
  });
    
    var User = Backbone.Model.extend({
        defaults:{
            user:"",
            count:"",
        }
        });
    
    var Domain = Backbone.Model.extend({
       
       defaults:{
        host_url:"",
        count:"",
       }
    });
    
    var DomainLibrary = Backbone.Collection.extend({
     model:Domain
     });
        
        var UserLibrary = Backbone.Collection.extend({
       model:User 
    });
    
    var Library = Backbone.Collection.extend({
     model:Tweet
     });
 
    
    var TweetView = Backbone.View.extend({
        tagName:"div",
        className:"tweetContainer",
        template:$("#tweetTemplate").html(),
        
        render:function(){
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
            }
        
        });
    
    var UserView = Backbone.View.extend({
        tagName:"div",
        className:"userContainer",
        template:$("#userTemplate").html(),
        render:function(){
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
        
    });
    
    var DomainView = Backbone.View.extend({
        tagName:"div",
        className:"domainContainer",
        template:$("#domainTemplate").html(),
        render:function(){
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
        
    });
    
    
    
    var LibraryView = Backbone.View.extend({
        el:$("#mains"),
        
        initialize:function(){
                        
           //_.bindAll(this);
            this.collection = new Library(tweets);
            this.user_collection = new UserLibrary(users);
            this.domain_collection = new DomainLibrary(domains);
            //console.log(tweets.length);
                        
            //this.collection.bind('add', this.render);
            if (loadfirst) {
                this.loadTweets();
                this.topUsers();
                this.topDomains();
                loadfirst = false;
                setTimeout( this.render(), 1000);
            }
            else
            this.render();
           
        },
        
        render:function(){
            
            var that = this;
            console.log(this.collection.models.length);
            console.log(this.user_collection.models.length);
            
$(".tweetContainer").remove();
$(".userContainer").remove();
$(".domainContainer").remove();

            _.each(this.collection.models, function(item){
                that.renderTweet(item);
            }, this);
            
            _.each(this.user_collection.models, function(item){
                that.renderUser(item);
            }, this);
            
            _.each(this.domain_collection.models, function(item){
                that.renderDomain(item);
            }, this);
        },
        
        events:{
            "click #fetch":"fetchUserTweets",
            "click #search":'searchUserTweets'
        },
        
        loadTweets:function(){
            
            var that = this;
             jQuery.get("/tweets", function(data, textStatus, jqXHR){
                
                json = eval(data);
                tweets = [];

                $.each(json, function(i, val)
                       {
                        tweet= { text:val["fields"]["text"],user:val["fields"]["tweeted_by"],source_url:val["fields"]["source_url"],time:"", tweet_id:val["fields"]["tweet_id"]};
                        tweets.push(tweet);
                       });
                that.initialize();
             });
             
            
        },
        
        topUsers:function(){
            console.log('first');
            var that = this;
            
             jQuery.get("/top/users", function(data, textStatus, jqXHR){
                
                json = eval(data);
                users = [];

                $.each(json, function(i, val)
                       {
                        user= { user:val["tweeted_by"],count:val["count"]};
                        users.push(user);
                       });
                that.initialize();
             });
        },
        
        topDomains:function(){
            var that = this;
            
             jQuery.get("/top/domains", function(data, textStatus, jqXHR){
                
                json = eval(data);
                domains = [];

                $.each(json, function(i, val)
                       {
                        domain= { host_url:val["host_url"],count:val["count"]};
                        domains.push(domain);
                       });
                that.initialize();
             });
        },
        
        fetchUserTweets:function(e){
            
            $(".tweetContainer").remove();
            e.preventDefault();
            var that = this;
            var screenName = $("#screenname").val();
            tweets=[];
            
            jQuery.get("/fetch/?screen_name="+screenName, function(data, textStatus, jqXHR){
                
                json = eval(data);
                that.tweets = [];

                $.each(json, function(i, val)
                       {                       
                        tweet= { text:val["text"],user:val["screen_name"],time:""};
                        tweets.push(tweet);
                        
                       });
                        that.initialize();
             });

        },
        
        searchUserTweets:function(e){
                        $(".tweetContainer").remove();
            e.preventDefault();
            var that = this;
            var screenName = $("#screenname").val();
            var searchQuery = $("#searchQuery").val();
            tweets=[];
            
            jQuery.get("/search/?screen_name=" + screenName + "&q=" + searchQuery, function(data, textStatus, jqXHR){
                json = eval(data);
                that.tweets=[]
                
                $.each(json, function(i,val)
                       {
                        tweet = {text:val["text"], user:val["screen_name"],time:""};
                        tweets.push(tweet);
                       });
                that.initialize();
            });
        },
        
        renderTweet:function(item){
            var tweetView = new TweetView({
                model:item
            });
            this.$el.find("#results").append(tweetView.render().el);
        },
        
        renderUser:function(item){
            var userView = new UserView({
                model:item
            });
            this.$el.find("#results2").append(userView.render().el);
        },
        
        renderDomain:function(item){
            var domainView = new DomainView({
                model:item
            });
            this.$el.find("#results3").append(domainView.render().el);
        },
        
        
        
        });
    
    var libraryView = new LibraryView();
    

})(jQuery);