from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

# Define una clase CustomUser que hereda de AbstractUser, permitiendo extender el modelo de usuario por defecto
class CustomUser(AbstractUser):  # Define una tupla de opciones para el campo 'role' (rol del usuario)
    # Cada opción es una tupla con el valor a almacenar y la etiqueta legible
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('emple', 'empleado'),
    )
    # Campo para almacenar el rol del usuario, utiliza CharField con un máximo de 10 caracteres,
    # y se limita a las opciones definidas en ROLE_CHOICES. El valor por defecto es 'user'
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    # Campo para almacenar el correo electrónico, se marca como único para que no se repitan
    email = models.EmailField(unique=True)

    # Define que el campo que se usará como identificador principal (username) es el correo electrónico
    USERNAME_FIELD = 'cec'
    # Campos requeridos adicionales para crear un usuario; en este caso, se requiere el 'username'
    REQUIRED_FIELDS = ['username']  # Se requiere el nombre de usuario

    telefono = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
    # Campo para almacenar el número de cédula del usuario, se marca como único para que no se repitan
    # Se establece que no puede estar vacío (blank=False) ni ser nulo (null=False)
    cec = models.CharField(
        max_length=10,
        blank=False,
        null=False,
        unique=True
    )
    status =models.CharField(max_length=20, default=' No activo')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Método especial que define la representación en forma de cadena del objeto
    # Aquí se devuelve el correo electrónico del usuario
    def __str__(self):
        return self.cec

# --------------------- Bakend del productos.hmtl ---------------------

class Producto(models.Model):
    imagen = models.ImageField(upload_to='productos/')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    origen = models.CharField(max_length=100)
    unidad = models.FloatField()  
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    publicado = models.BooleanField(default=True)
    medida = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    

# --------------------- Bakend creacion de cliente   ---------------------

class CustomCliente(AbstractUser):  
    ROLE_CHOICES = (
        ('user', 'Usuario'),
    )
    roleCliente = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'CC'
    REQUIRED_FIELDS = ['username']  
    telefono = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
    CC = models.CharField(
        max_length=10,
        blank=False,
        null=False,
        unique=True
    )

    # Agregar related_name para evitar conflictos
    groups = models.ManyToManyField(
        Group,
        related_name="customcliente_groups",  # Cambia el nombre de la relación inversa
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customcliente_user_permissions",  # Cambia el nombre de la relación inversa
        blank=True
    )

    def __str__(self):
        return self.CC
