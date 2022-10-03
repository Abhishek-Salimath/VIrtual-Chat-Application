from django.db import models

# Create your models here.
class ChannelMember(models.Model):
    name=models.CharField(max_length=200)
    uid=models.CharField(max_length=200)
    channel_name=models.CharField(max_length=200)



    def __str__(self):
        return self.name