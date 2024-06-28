from django.contrib import admin
from .models import Productos, Categoria, Marca, Carrito, ItemCarrito, Solicitud, Compra, ItemCompra
# Register your models here.

admin.site.register(Productos)
admin.site.register(Categoria)
admin.site.register(Marca)
admin.site.register(Carrito)
admin.site.register(ItemCarrito)
admin.site.register(Solicitud)
admin.site.register(Compra)
admin.site.register(ItemCompra)