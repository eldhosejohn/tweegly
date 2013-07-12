from django.db import models
from django.contrib.auth.models import User

class Tweet(models.Model):
    text = models.CharField(max_length=150)
    tweet_id = models.IntegerField()
    source_url = models.URLField()
    display_url = models.URLField()
    host_url = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField()
    user = models.ForeignKey(User)
    tweeted_by = models.CharField(max_length=50)
    
    
    
    
