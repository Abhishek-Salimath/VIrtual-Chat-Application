from django.urls import path, include
from . import views




urlpatterns = [
    path('',views.lobby,name='lobby'),
    path('room/',views.room,name='room'),
    path('gen-token/',views.genToken,name='gen-token'),
    path('create-mem/',views.createMem,name='create-mem'),
    path('get-mem/',views.getMem,name='get-mem'),
    path('delete-mem/',views.deleteMem,name='delete-mem'),
]
