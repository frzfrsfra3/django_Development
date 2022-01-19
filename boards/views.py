from django.http.response import Http404
from django.shortcuts import render,get_object_or_404, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, UserManager
from .models import Board,Topic
from .forms import NewTopicForm
from .models import Topic,Post
# Create your views here.
def home(request):

    boards = Board.objects.all()
    return render(request,'home.html',{'boards' : boards})
def about(request):
    return HttpResponse(request,"yes")        
def board_topics(request,board_id): 
#     try:
#     board = Board.objects.get(pk= board_id)        
#     except Board.DoesNotExist:
#          raise Http404
    board=get_object_or_404(Board,pk=board_id)
    return render(request,'topics.html',{'board' : board})
#     boards_names= []
#     for board in boards: 
#         boards_names.append(board.name) 
#     print(boards_names)      
#     response_html = '<br>'.join(boards_names)
#     return HttpResponse(response_html)

#     return HttpResponse(boards_names)
def new_topic(request,board_id): 
    board=get_object_or_404(Board,pk=board_id)  
#     if request.method== 'POST':
            
#          subject= request.POST['subject']  
#          message= request.POST['message']  
#          user= User.objects.first()
#          topic=Topic.objects.create(
#                  subject=subject,
#                  board=board,
#                  created_by=user


#          )
#          post=Post.objects.create(
#                  message=message,
#                  topic=topic,
#                  created_by=user
#          )
#          return redirect('board_topics',board_id=board.pk)
#     return render(request,'new_topic.html' ,{'board' : board})    
    form =NewTopicForm()
    user= User.objects.first()
    if request.method== 'POST':
        form =NewTopicForm(request.POST)   
        if form.is_valid():
          topic=form.save(commit=False)   
          topic.board = board 
          topic.created_by = user
          topic.save()
          post=Post.objects.create(
               message=form.cleaned_data.get('message'),
               created_by=user,
               topic=topic,
                       
          )
          return redirect('board_topics',board_id=board.pk)
    else:
         form =NewTopicForm()        
         return render(request,'new_topic.html' ,{'board' : board,'form':form})       
def input_type(request):
    # form =NewProteinForm()
    user= User.objects.first()
    # if request.method== 'POST':
    #     form =NewProteinForm(request.POST)   
        # if form.is_valid():
        #   topic=form.save(commit=False)   
        #   topic.board = board 
        #   topic.created_by = user
        #   topic.save()
        #   post=Post.objects.create(
        #        message=form.cleaned_data.get('message'),
        #        created_by=user,
        #        topic=topic,
                       
        #   )
        #   return redirect('board_topics',board_id=board.pk)
    # else:
    #      form =NewProteinForm()   


    return render(request,'input.html') 
def test(req):
    return render(req,'test.html')    
    # return HttpResponse(request)    

