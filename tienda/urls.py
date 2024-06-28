from django.urls import path, re_path
from django.contrib.auth.views import LoginView, LogoutView
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
    path('login/', LoginView.as_view(template_name='tienda/login.html'), name='login'),
    path('registro/', views.registro, name='registro'),
    path('logout/', LogoutView.as_view(template_name='tienda/logout.html'), name='logout'),
    path('profile/', views.profile, name='profile'),
    path('sumar-cantidad/<int:item_id>/<int:cantidad>/', views.actualizar_cantidad, name='sumar_cantidad'),
    re_path(r'^restar-cantidad/(?P<item_id>\d+)/(?P<cantidad>-?\d+)/$', views.restar_cantidad, name='restar_cantidad'),
    path('agregar/<int:producto_id>/', views.agregar_al_carrito, name='agregar_al_carrito'),
    path('eliminar/<int:item_id>/', views.eliminar_del_carrito, name='eliminar_del_carrito'),
    path('limpiar/', views.limpiar_carrito, name='limpiar_carrito'),
    path('pagar/', views.pagar, name='pagar'),
    path('obtener-cantidad-carrito/', views.obtener_cantidad_carrito, name='obtener_cantidad_carrito')

]
