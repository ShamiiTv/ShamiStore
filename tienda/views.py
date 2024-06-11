from django.shortcuts import render
from .models import Productos

def index(request):
    return render(request, 'tienda/index.html',)


def graficas(request):
    productos = Productos.objects.filter(categoria=1).values()
    contextGraficas = {"Graficas": productos}
    return render(request, 'tienda/graficas.html',contextGraficas)

def monitores(request):
    productos = Productos.objects.filter(categoria=3).values()
    contextMonitores = {"Monitores": productos}
    return render(request, 'tienda/monitores.html',contextMonitores)

def procesadores(request):
    productos = Productos.objects.filter(categoria=2).values()
    contextProcesadores = {"Procesadores": productos}
    return render(request, 'tienda/procesadores.html',contextProcesadores)

def teclados(request):
    productos = Productos.objects.filter(categoria=4).values()
    contextTeclados = {"Teclados": productos}
    return render(request, 'tienda/teclados.html',contextTeclados)

def mouses(request):
    productos = Productos.objects.filter(categoria=5).values()
    contextMouses = {"Mouses": productos}
    return render(request, 'tienda/mouses.html',contextMouses)

def contacto(request):
    # Lógica para la página de contacto aquí
    return render(request, 'tienda/contacto.html')

def sobrenosotros(request):
    # Lógica para la página de sobre nosotros aquí
    return render(request, 'tienda/sobrenosotros.html')

def carrito(request):
    # Lógica para la página del carrito aquí
    return render(request, 'tienda/carrito.html')
