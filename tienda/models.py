from django.db import models
from django.contrib.auth.models import User


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    def __str__(self):
        return self.nombre

class Marca(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    def __str__(self):
        return self.nombre

class Productos(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.FloatField()
    precioDolar = models.FloatField(default=0.0)
    SrcImagen = models.CharField(default="./Images/Productos/",max_length=300)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, default=1)
    def __str__(self):
        return self.nombre
    
class Carrito(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    def __str__(self):
        return f"Carrito de {self.usuario.username}"
    
class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, related_name="items", on_delete=models.CASCADE)
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.producto.nombre} de {self.carrito}"


class Solicitud(models.Model):
    ASUNTO_CHOICES = [
        ('consulta', 'Consulta'),
        ('reclamo', 'Reclamo'),
        ('sugerencia', 'Sugerencia'),
        ('otro', 'Otro'),
    ]
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    celular = models.CharField(max_length=20)
    asunto = models.CharField(max_length=20, choices=ASUNTO_CHOICES)
    mensaje = models.TextField()

    def __str__(self):
        return f' Usuario : {self.user} - {self.nombre} - {self.asunto}'
