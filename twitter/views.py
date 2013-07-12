from django.shortcuts import render_to_response, render, redirect
from social_auth.models import UserSocialAuth
from twython import Twython
from django.http import HttpResponse
from django.conf import settings
from models import Tweet
import time
from django.core import serializers
import urlparse
from django.db.models import Count
import json

def update_tweets(request):
    twitter_auth = request.user.social_auth.filter(provider='twitter')[0]
    oauth_token = twitter_auth.tokens['oauth_token']
    oauth_secret = twitter_auth.tokens['oauth_token_secret']
    
    twitter = Twython(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET, oauth_token, oauth_secret)
    
    tweets = twitter.get_home_timeline(count=200)
    
    for tweet in tweets:
        if len(tweet['entities']['urls']) != 0:
            if not (Tweet.objects.filter(tweet_id=tweet['id'], user=request.user)):
                tweet_object = Tweet()
                tweet_object.tweet_id = tweet['id']
                tweet_object.text = tweet['text']
                tweet_object.source_url = tweet['entities']['urls'][0]['expanded_url']
                tweet_object.display_url = tweet['entities']['urls'][0]['display_url']
                tweet_object.host_url = urlparse.urlparse(tweet['entities']['urls'][0]['expanded_url']).hostname
                tweet_object.created_at =  time.strftime('%Y-%m-%d %H:%M:%S', time.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y'))
                tweet_object.tweeted_by = tweet['user']['screen_name']
                tweet_object.user = request.user
                tweet_object.save()
                

def home(request):
    if request.user.is_authenticated():
        if len(Tweet.objects.filter(user=request.user)) == 0:
            update_tweets(request)
        return render_to_response('twitter.html', locals())
    else:
        return render_to_response('home.html')
    
def tweets(request):
    tweets = Tweet.objects.filter(user=request.user)
    data =  serializers.serialize("json", tweets)
    return HttpResponse(data, content_type="application/json")

def top_users(request):
    top_users = Tweet.objects.filter(user=request.user).values('tweeted_by').annotate(count=Count('tweeted_by')).order_by('-count')
    
    #Issue in serializing ObjectValueQuerySet
    user_list = list()
    for user in top_users:
        o = dict()
        o['count']=user['count']
        o['tweeted_by']=user['tweeted_by']
        user_list.append(o)
    
    return HttpResponse(json.dumps(user_list), content_type="application/json")

def top_domains(request):
    top_domains = Tweet.objects.filter(user=request.user).values('host_url').annotate(count=Count('host_url')).order_by('-count')
        
    #Issue in serializing ObjectValueQuerySet
    domains = list()
    for domain in top_domains:
        o = dict()
        o['host_url']=domain['host_url']
        o['count']=domain['count']
        domains.append(o)
        
    return HttpResponse(json.dumps(domains), content_type="application/json")

    
    
    

    
    
    

