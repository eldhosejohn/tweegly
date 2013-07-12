from django.conf.urls import patterns, include, url


urlpatterns = patterns('',
    url(r'^$', 'twitter.views.home', name='home'),    
    url(r'tweets', 'twitter.views.tweets', name='tweets'),
    url(r'top/users', 'twitter.views.top_users', name='top_users'),
    url(r'top/domains', 'twitter.views.top_domains', name='top_domains'),
)
