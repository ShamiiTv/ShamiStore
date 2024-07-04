from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils.formats import localize
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Productos, Carrito, ItemCarrito, Solicitud, Compra, ItemCompra
from .forms import *
import requests

@login_required
def profile(request):
    compras = Compra.objects.filter(usuario=request.user).order_by('-fecha')
    return render(request, 'tienda/profile.html', {'compras': compras})

def registro(request):
    if request.method == "POST":
        registro = registroForm(request.POST)
        if registro.is_valid():
            registro.save()
            return render(request, 'tienda/index.html')
    else:
        registro = registroForm()

    return render(request, 'tienda/registro.html', {"form": registro})

def index(request):
    return render(request, 'tienda/index.html')

def graficas(request):
    productos = Productos.objects.filter(categoria=1).values()
    contextGraficas = {"Graficas": productos}
    return render(request, 'tienda/graficas.html', contextGraficas)

def monitores(request):
    productos = Productos.objects.filter(categoria=3).values()
    contextMonitores = {"Monitores": productos}
    return render(request, 'tienda/monitores.html', contextMonitores)

def procesadores(request):
    productos = Productos.objects.filter(categoria=2).values()
    contextProcesadores = {"Procesadores": productos}
    return render(request, 'tienda/procesadores.html', contextProcesadores)

def teclados(request):
    productos = Productos.objects.filter(categoria=4).values()
    contextTeclados = {"Teclados": productos}
    return render(request, 'tienda/teclados.html', contextTeclados)

def mouses(request):
    productos = Productos.objects.filter(categoria=5).values()
    contextMouses = {"Mouses": productos}
    return render(request, 'tienda/mouses.html', contextMouses)

def contacto(request):
    return render(request, 'tienda/contacto.html')

def sobrenosotros(request):
    return render(request, 'tienda/sobrenosotros.html')

@login_required
def carrito(request):
    carrito, created = Carrito.objects.get_or_create(usuario=request.user)
    items = carrito.items.all()
    dolar = requests.get("https://mindicador.cl/api/dolar").json()
    preciodolar = dolar.get('serie')[0].get('valor')
    total_clp = sum(item.producto.precio * item.cantidad for item in items)
    total_usd = round(total_clp / preciodolar, 2)
    return render(request, 'tienda/carrito.html', {'items': items, 'total_clp': total_clp, 'total_usd': total_usd})

@login_required
def agregar_al_carrito(request, producto_id):
    producto = get_object_or_404(Productos, id=producto_id)
    carrito, created = Carrito.objects.get_or_create(usuario=request.user)
    item, created = ItemCarrito.objects.get_or_create(carrito=carrito, producto=producto)
    if not created:
        item.cantidad += 1
    item.save()
    return redirect('carrito')

@login_required
def eliminar_del_carrito(request, item_id):
    item = get_object_or_404(ItemCarrito, id=item_id)
    item.delete()
    return redirect('carrito')

@login_required
def limpiar_carrito(request):
    carrito = Carrito.objects.get(usuario=request.user)
    carrito.items.all().delete()
    return redirect('carrito')

def format_clp(total_clp):
    total_clp = int(total_clp)
    formatted = f"{total_clp:,}"
    formatted = formatted.replace(',', '.')
    return formatted

@login_required
def actualizar_cantidad(request, item_id, cantidad):
    item = get_object_or_404(ItemCarrito, id=item_id)
    carrito = item.carrito
    dolar = requests.get("https://mindicador.cl/api/dolar").json()
    preciodolar = dolar.get('serie')[0].get('valor')

    try:
        cantidad = int(cantidad)
    except ValueError:
        return JsonResponse({'error': 'Cantidad no válida'}, status=400)

    nueva_cantidad = item.cantidad + cantidad

    if nueva_cantidad > item.producto.stock:
        return JsonResponse({'error': f'No hay suficiente stock para {item.producto.nombre}. Disponible: {item.producto.stock}'}, status=400)
    
    if nueva_cantidad < 1:
        item.delete()
        cantidad_actualizada = 0
    else:
        item.cantidad = nueva_cantidad
        item.save()
        cantidad_actualizada = item.cantidad

    items = carrito.items.all()
    total_clp = sum(i.producto.precio * i.cantidad for i in items)
    total_usd = round(total_clp / preciodolar, 2)
    total_clp_formatted = f"Total CLP : ${format_clp(total_clp)}"
    total_usd_formatted = f"Total USD : ${total_usd:.2f}".replace(',', '.')

    return JsonResponse({
        'mensaje': f'Cantidad actualizada a {cantidad_actualizada}',
        'cantidad_actualizada': cantidad_actualizada,
        'total_clp': total_clp_formatted,
        'total_usd': total_usd_formatted
    })

@require_http_methods(["GET"])
@login_required
def obtener_cantidad_carrito(request):
    carrito_usuario = Carrito.objects.get(usuario=request.user)
    cantidad_carrito = carrito_usuario.items.count()

    return JsonResponse({'cantidad_carrito': cantidad_carrito})

@login_required
def restar_cantidad(request, item_id, cantidad):
    item = get_object_or_404(ItemCarrito, id=item_id)
    carrito = item.carrito
    dolar = requests.get("https://mindicador.cl/api/dolar").json()
    preciodolar = dolar.get('serie')[0].get('valor')

    try:
        cantidad = int(cantidad)
    except ValueError:
        return JsonResponse({'error': 'Cantidad no válida'}, status=400)

    nueva_cantidad = item.cantidad - cantidad

    if nueva_cantidad < 1:
        item.delete()
        cantidad_actualizada = 0
    else:
        item.cantidad = nueva_cantidad
        item.save()
        cantidad_actualizada = item.cantidad

    items = carrito.items.all()
    total_clp = sum(i.producto.precio * i.cantidad for i in items)
    total_usd = round(total_clp / preciodolar, 2)
    total_clp_formatted = f"Total CLP : ${format_clp(total_clp)}"
    total_usd_formatted = f"Total USD : ${total_usd:.2f}".replace(',', '.')

    return JsonResponse({
        'mensaje': f'Cantidad actualizada a {cantidad_actualizada}',
        'cantidad_actualizada': cantidad_actualizada,
        'total_clp': total_clp_formatted,
        'total_usd': total_usd_formatted
    })

@login_required
def contacto(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            solicitud = form.save(commit=False)
            solicitud.user = request.user 
            solicitud.save()
            messages.success(request, 'Tu solicitud ha sido enviada exitosamente.')
            return redirect('contacto')
    else:
        form = ContactForm()

    solicitudes = Solicitud.objects.filter(user=request.user)
    return render(request, 'tienda/contacto.html', {'form': form, 'solicitudes': solicitudes})

@login_required
def pagar(request):
    carrito = Carrito.objects.get(usuario=request.user)
    items = carrito.items.all()
    errores = []

    for item in items:
        if item.cantidad > item.producto.stock:
            errores.append(f"No hay suficiente stock para {item.producto.nombre}. Disponible: {item.producto.stock}")

    if errores:
        messages.error(request, ". ".join(errores))
        return redirect('carrito')
    
    dolar = requests.get("https://mindicador.cl/api/dolar").json()
    preciodolar = dolar.get('serie')[0].get('valor')

    total_clp = sum(item.producto.precio * item.cantidad for item in items)
    total_usd = round(total_clp / preciodolar, 2)

    compra = Compra.objects.create(usuario=request.user, total_clp=total_clp, total_usd=total_usd)
    
    for item in items:
        producto = item.producto
        producto.stock -= item.cantidad
        producto.save()
        
        ItemCompra.objects.create(
            compra=compra,
            producto=producto,
            cantidad=item.cantidad,
            precio_clp=item.producto.precio,
            precio_usd=round(item.producto.precio / preciodolar, 2)
        )
        
    carrito.items.all().delete()
    messages.success(request, 'Pago realizado con éxito. Gracias por tu compra!')
    return redirect('carrito')
