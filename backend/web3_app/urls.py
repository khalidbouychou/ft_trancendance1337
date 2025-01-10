from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_scores/", views.get_scores, name="get_scores"),
    path("get_scores_num/", views.get_scores_num, name="get_scores_num"),
    path("get_first_score/", views.get_first_score, name="get_first_score"),
    path("get_last_score/", views.get_last_score, name="get_last_score"),
    path("add_score/", views.add_score, name="add_score"), 
    # path("hello_world", views.hello_world, name="hello_world"),
]
