from django import forms
from .models import Topic,Protein
class NewTopicForm(forms.ModelForm):
    message = forms.CharField(widget=forms.Textarea(
           attrs={'rows':5,'placeholder':'What is on your mind?'}
    )
  ,
    max_length=4000,
      help_text='The max length of the text is 4000',
    
    )
    class Meta:
        model = Topic
        fields = ['subject','message']
# class NewProteinForm(forms.ModelForm):

#   #   message = forms.CharField(widget=forms.Textarea(
#   #          attrs={'rows':5,'placeholder':'What is on your mind?'}
#   #   )
#   # ,
#   #   max_length=4000,
#   #     help_text='The max length of the text is 4000',
    
#   #   )
#     class Meta:
#         model = Protein
#         fields =['test']
        # fields = ['subject','message']
