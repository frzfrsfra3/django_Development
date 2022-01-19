from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes import fields
# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=50,unique=True)
    description = models.CharField(max_length=150 )
    def __str__(self):
        return self.name
class Topic(models.Model):
    subject = models.CharField(max_length=255)
    board = models.ForeignKey(Board,related_name='topics',on_delete=models.CASCADE)    
    created_by = models.ForeignKey(User,related_name='topics',on_delete=models.CASCADE)
    created_dt = models.DateTimeField(auto_now_add=True)
    updated_dt = models.DateTimeField(auto_now=True)
class Post(models.Model):
    message = models.TextField(max_length=4000)
    topic = models.ForeignKey(Topic,related_name='posts',on_delete=models.CASCADE)    
    created_by = models.ForeignKey(User,related_name='posts',on_delete=models.CASCADE)
    created_dt = models.DateTimeField(auto_now_add=True)
    updated_dt = models.DateTimeField(auto_now=True)
class Comment(models.Model):
    # content = models.TextField()
    comm = models.CharField(max_length=50)
   # document= models.ForeignKey(Document,related_name='comments',on_delete=models.CASCADE)  
   # protein= models.ForeignKey(Protein,related_name='comments',on_delete=models.CASCADE)   
    # topic = models.ForeignKey(Topic,related_name='posts',on_delete=models.CASCADE)    
    content_type=models.ForeignKey(ContentType,on_delete=models.CASCADE)
    object_id=models.PositiveIntegerField()
    content_object=GenericForeignKey('content_type','object_id')
    created_by = models.ForeignKey(User,related_name='comments',on_delete=models.CASCADE)
    created_dt = models.DateTimeField(auto_now_add=True)
    updated_dt = models.DateTimeField(auto_now=True)
    # def __str__(self):
    #     return self.comm
    # def save(self, *args, **kwargs):
    #     self.full_clean()
    #     return super().save(*args, **kwargs)   
class Document(models.Model):
    content = models.CharField(max_length=100,null=True)
    comments = GenericRelation(Comment)
    # topic = models.ForeignKey(Topic,related_name='posts',on_delete=models.CASCADE)    
    created_by = models.ForeignKey(User,related_name='documents',on_delete=models.CASCADE)
    created_dt = models.DateTimeField(auto_now_add=True)
    updated_dt = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.content
    # def save(self, *args, **kwargs):
    #     self.full_clean()
    #     return super().save(*args, **kwargs)
    
class Protein(models.Model):
    AA_seq = models.TextField(max_length=10000)
    DNA_seq =  models.TextField(max_length=str(AA_seq)*3)
    content = models.CharField(max_length=100,null=True)
    created_by = models.ForeignKey(User,related_name='proteins',on_delete=models.CASCADE)
    created_dt = models.DateTimeField(auto_now_add=True)
    updated_dt = models.DateTimeField(auto_now=True)
    comments = GenericRelation(Comment)
    def __str__(self):
        return self.content    
    # def save(self, *args, **kwargs):
    #     self.full_clean()
    #     return super().save(*args, **kwargs)
 


class Notification(models.Model):
    message = models.TextField()
    created_dt = models.DateTimeField(auto_now_add=True)
    type=  models.CharField(max_length=50)
    notificationlink_id=  models.CharField(max_length=50) # it should be id of :  document or protein or comment, so we could use notification when create object of them
    notificationlink=  models.CharField(max_length=50) # it should : document or protein or comment
    icon= models.CharField(max_length=50)
    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
# class Payer(models.Model):

#     name = models.CharField(blank=True, max_length=100)
#     # Nullable, but will enforce FK in clean/save:
#     payer_group = models.ForeignKey(PayerGroup, null=True, blank=True,)

#     def clean(self):
#         # Ensure every Payer is in a PayerGroup (but only via forms)
#         if not self.payer_group:
#             raise ValidationError(
#                 {'payer_group': 'Each Payer must belong to a PayerGroup.'})

#     def save(self, *args, **kwargs):
#         self.full_clean()
#         return super().save(*args, **kwargs)

#     def __str__(self):
#         return self.name    