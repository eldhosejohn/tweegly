(function ($) {

        
    var tweets =[];

    var Tweet = Backbone.Model.extend({
        defaults:{
            text:"",
            username:"",
            time:"",
        }
    });
       
    var TweetCollection = Backbone.Collection.extend({
        model:Tweet
        });
    
    var TweetView = Backbone.View.extend({
        el:$('#main'),
        indexTemplate:$("#tweetTemp").template(),
        render:function(){
           var sg = this;
           sg.el.empty();
           $.tmpl(sg.indexTemplate, sg.model.toArray()).appendTo(sg.el);
            
            return this;
        }
    });
    
    var TweetController = Backbone.Controller.extend({
        _data:null,
        _tweets:null,
        initialize:function(options){
            var ws=this;
            $.ajax({
                url:'/tweets',
                dataType:'json',
                data:{},
                success:function(data){
                    w._data = data,
                    ws._tweets = new TweetCollection(data);
                    }
                });
            }
            });
})(jQuery);
