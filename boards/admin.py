from django.contrib import admin

from boards.models import Board
from .models import Board
# Register your models here.
admin.site.register(Board)