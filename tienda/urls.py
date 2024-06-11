from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('graficas/', views.graficas, name='graficas'),
    path('monitores/', views.monitores, name='monitores'),
    path('procesadores/', views.procesadores, name='procesadores'),
    path('teclados/', views.teclados, name='teclados'),
    path('mouses/', views.mouses, name='mouses'),
    path('contacto/', views.contacto, name='contacto'),
    path('sobrenosotros/', views.sobrenosotros, name='sobrenosotros'),
    path('carrito/', views.carrito, name='carrito'),
]