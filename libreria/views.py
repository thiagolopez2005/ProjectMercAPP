from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Producto
from django.shortcuts import render, redirect, get_object_or_404
from .forms import ProductoForm
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from libreria.backends import CustomClienteBackend
from django.http import JsonResponse
from .forms import CustomUserCreationForm, CustomAuthenticationForm, CustomUserChangeForm
from .models import CustomUser
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from .models import Proveedor
from .forms import ProveedorForm
from django.shortcuts import render, redirect, get_object_or_404
from .models import Factura
from .forms import FacturaForm
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.hashers import make_password
from django.urls import reverse




# -------- REGISTRO PARA EL EMPLEADO Y ADMINISTRADOR------
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  # No guardes el usuario aún
            user.username = form.cleaned_data['cec']  # Asigna el valor de 'cec' al campo 'username'
            user.save()  # Guarda el usuario con el campo 'username' actualizado
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/formulario.html', {'form': form})

#------------- registro de cliente -----------
from .forms import CustomClienteCreationForm

def register_cliente_view(request):
    if request.method == 'POST':
        form = CustomClienteCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  # No guardes el usuario aún
            user.username = form.cleaned_data['cec']  # Asigna el valor de 'cec' al campo 'username'
            user.save() 
            form.save()
            return redirect('login')  # Redirige al login después de registrar
    else:
        form = CustomClienteCreationForm()
    return render(request, 'accounts/registro_cliente.html', {'form': form})
# -------------------LOGEO PARA EL ADMINITSARDOR Y EMPLEADO---------------------------
# AQUI CADA USUARIO TIENE SUS VISTAS DEFINIDAS, COMO VISTA_ADMIN Y VISTA_EMPLE

def login_view(request):
    error_message = ''
    if request.method == 'POST':
        cec = request.POST.get('cec')  
        password = request.POST.get('password')
        role = request.POST.get('role')
        user = authenticate(request, username=cec, password=password)
        
        if user is not None:
            if user.role != role:
                error_message = 'El rol seleccionado no coincide con el de tu cuenta.'
            else:
                login(request, user)
                if role == 'admin':
                    return redirect('dashboard')  # Redirige al panel de administración
                elif role == 'emple':
                    return redirect('vista_emple')
        else:
            error_message = 'CC o contraseña incorrectos.'
    form = CustomAuthenticationForm()
    return render(request, 'accounts/AdminEmpleClient.html', {'form': form, 'error_message': error_message})

# -------------------login del cliente-------------
# AQUI EL CLIENTE SE LOGEA, SE CREO UN ARCHIVO LLAMDA BACKENDS.PY PARA VALIDAR QUE EL USUARIO ESTA REGISTRADO
# EN LA BASE DE DATOS Y QUE SU ROL ES CLIENTE, SI NO LO ES NO SE LE PERMITE EL ACCESO

def login_cliente_view(request):
    error_message = ''
    if request.method == 'POST':
        CC = request.POST.get('CC')  # Campo para el cliente
        password = request.POST.get('password')
        
        backend = CustomClienteBackend()
        # Autenticar al cliente
        user = authenticate(request, nombre=CC, password=password)

        if user is not None:
            # Verificar si el usuario es un cliente
            if hasattr(user, 'roleCliente') and user.roleCliente == 'user':
                login(request, user)
                return redirect('Productos')  # Redirige a la vista de productos
            else:
                error_message = 'No tienes permisos de cliente.'
        else:
            error_message = 'Credenciales inválidas.'
    return render(request, 'accounts/AdminEmpleClient.html', {'error_message': error_message})

# ---------------------------VISTAS Y POST DE MERCAPP ------------------------------------------
# AQUI EL EMPELADO , ADMIN Y CLIENTE CIERRAN SESION, SE REDIRECCIONA A LA PRINCIPAL
def logout_view(request):
    logout(request)
    return redirect('Principal')

# ---------------------------VISTA PARA EL PANEL DEL ADMINISTRADOR-----------------------------
@login_required
def dashboard_view(request):
    # Obtén todos los usuarios registrados
    productos_count = Producto.objects.count()
    cuentas = CustomUser.objects.all()
    print(cuentas)
    return render(request, 'accounts/dashboard.html', {'cuentas': cuentas, 'productos_count': productos_count})
# ---------------------------VISTA PARA EL PANEL DEL EMPLEADO-----------------------------
# AQUI EL EMPLEADO PUEDE VER LOS PRODUCTOS QUE SE ENCUENTRAN EN EL INVENTARIO
@login_required
def vista_emple(request):
    productos = Producto.objects.all()  # Recupera todos los productos
    context = {
        'productos': productos,
    }
    return render(request, 'accounts/vista_emple.html')


#---------------- visualizar los produdctos en el inventario--------------

def obtener_productos_json(request):
    productos = Producto.objects.all().values('nombre', 'descripcion', 'unidad', 'medida', 'stock')  # Obtiene los campos específicos
    return JsonResponse(list(productos), safe=False)

# -----------------Entrega los datos de los prodcutos subidos al backend---------------
# AQUI SE MUESTRAN LOS PRODUCTOS QUE SE ENCUENTRAN EN EL INVENTARIO, SE PUEDE EDITAR Y ELIMINAR
# LOS PRODUCTOS, SE PUEDE PUBLICAR O QUITAR LA PUBLICACION DE LOS PRODUCTOS
def productos2(request):
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('productos2')
    else:
        form = ProductoForm()

    # Filtrar productos por categoría
    frutas = Producto.objects.filter(tipoproducto='frutas')
    verduras = Producto.objects.filter(tipoproducto='verduras')
    tuberculos = Producto.objects.filter(tipoproducto='tuberculos')
    hortalizas = Producto.objects.filter(tipoproducto='hortalizas')

    # Combina todos los datos en un solo diccionario
    context = {
        'form': form,
        'frutas': frutas,
        'verduras': verduras,
        'tuberculos': tuberculos,
        'hortalizas': hortalizas,
        'productos': Producto.objects.all(),  # Recupera todos los productos
    }

    return render(request, 'accounts/productos2.html', context)


def productos(request):
    imagenes_publicadas = Producto.objects.filter(publicado=True)
    return render(request, 'accounts/Productos.html', {'imagenes_publicadas': imagenes_publicadas})  # Pasa los productos al contexto



# --------------------- Bakend del productos.hmtl ---------------------

def agregar_producto(request):
    if request.method == 'POST':
        imagen = request.FILES.get('imagen')
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        origen = request.POST.get('origen')
        unidad = request.POST.get('unidad')
        precio = request.POST.get('precio')
        if imagen and descripcion and origen and unidad and precio and  nombre:
            producto = Producto.objects.create(
                imagen=imagen,
                nombre=nombre,
                descripcion=descripcion,
                origen=origen,
                unidad=unidad,
                precio=precio,
            )
            return JsonResponse({               
                'imagen_url': producto.imagen.url,
                'id': producto.id,
                'nombre': producto.nombre,
                'descripcion': producto.descripcion,
                'origen': producto.origen,
                'unidad': producto.unidad,
                'precio': str(producto.precio),
            })
        else:
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


# ------------------ VISTAS DE CADA HTML ----------------------

def home(request):
    return render(request, 'accounts/Principal.html')

def inventario(request):
    productos = Producto.objects.all()  # Recupera todos los productos para luego visualizarlos 
    return render(request, 'accounts/inventario.html', {'productos': productos})

def Principal(request):
    return render(request, 'accounts/Principal.html')

def Nosotros(request):
    return render(request, 'accounts/Nosotros.html')

def Servicios(request):
    return render(request, 'accounts/Servicios.html')

def carrito(request):
    return render(request, 'accounts/carrito.html')

# ----------- VISTAS PARA LA PUBLICACION DE UN PRODUCTO 
def index(request):
    return render(request, 'accounts/Principal.html')

def editar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():
            print("Formulario válido. Guardando cambios...")
            form.save()
            return redirect('productos2')
        else:
            print("Errores en el formulario:", form.errors)
    else:
        form = ProductoForm(instance=producto)
    return render(request, 'accounts/editar_producto.html', {'form': form})

def eliminar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == "POST":
        producto.delete()
        return redirect('productos2')
    return render(request, 'accounts/confirmar_eliminar.html', {'producto': producto})

def subir_imagen(request):
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('productos2')
    else:
        form = ProductoForm()
    return render(request, 'accounts/subir_imagen.html', {'form': form})

def publicar_producto(request, productoId):
    if request.method == 'POST':
        imagen = get_object_or_404(Producto, id=productoId)
        imagen.publicado = True
        imagen.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

def quitar_publicidad(request, productoId):
    if request.method == 'POST':
        imagen = get_object_or_404(Producto, id=productoId)
        imagen.publicado = False
        imagen.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})



# ----------------- VISTAS PARA LA ADMINISTRACION DE CUENTAS ------------------
# AQUI SE MUESTRAN LOS USUARIOS REGISTRADOS EN EL SISTEMA, SE PUEDEN EDITAR, ACTIVAR, DESACTIVAR Y ELIMINAR
# def usuarios(request):
#     cuentas = CustomUser.objects.all()
#     return render(request, 'accounts/usuarios.html', {'cuentas': cuentas})

def editar_cuenta(request, id):
    # Obtén el usuario correspondiente al ID
    cuenta = get_object_or_404(CustomUser, id=id)
    if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, instance=cuenta)
        if form.is_valid():
            form.save()
            return redirect('dashboard')  # Redirige al dashboard después de guardar
    else:
        form = CustomUserChangeForm(instance=cuenta)
    return render(request, 'accounts/editar_cuenta.html', {'form': form, 'cuenta': cuenta})

def activar_cuenta(request, id):
    """
    Activa la cuenta estableciendo el campo is_active a True.
    """
    cuenta = get_object_or_404(CustomUser, id=id)
    cuenta.is_active = True
    cuenta.save()
    return redirect('listar_registros')

def desactivar_cuenta(request, id):
    """
    Desactiva la cuenta estableciendo el campo is_active a False.
    """
    cuenta = get_object_or_404(CustomUser, id=id)
    cuenta.is_active = False
    cuenta.save()
    return redirect('listar_registros')

def eliminar_cuenta(request, id):
    """
    Elimina la cuenta del usuario de forma definitiva.
    """
    cuenta = get_object_or_404(CustomUser, id=id)
    cuenta.delete()
    return redirect('dashboard')

# -------------------------------------------
# REGISTRO DE LOS PROVEEDORES EN EL BACKEND
# -------------------------------------------

@login_required
def registrar_proveedor(request):
    if request.method == 'POST':
        form = ProveedorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard')  # Redirige a la lista de proveedores
    else:
        form = ProveedorForm()
    return render(request, 'accounts/registrar_proveedores.html', {'form': form})

@login_required
def inhabilitar_proveedor(request, id):
    proveedor = get_object_or_404(Proveedor, id=id)
    proveedor.activo = False
    proveedor.save()
    return redirect('dashboard')

@login_required
def habilitar_proveedor(request, id):
    proveedor = get_object_or_404(Proveedor, id=id)
    proveedor.activo = True
    proveedor.save()
    return redirect('dashboard')

@login_required
def editar_proveedor(request, id):
    proveedor = get_object_or_404(Proveedor, id=id)
    if request.method == 'POST':
        form = ProveedorForm(request.POST, instance=proveedor)
        if form.is_valid():
            form.save()
            return redirect('dashboard')  # Redirige al dashboard después de guardar
    else:
        form = ProveedorForm(instance=proveedor)
    return render(request, 'accounts/editar_proveedor.html', {'form': form, 'proveedor': proveedor})

# -------------------------------------------
# REGISTRO DE LOS RECIBOSDE LOS PRODUCTOS EN EL BACKEND
# --------------------------------------------

def factura(request):
    # Obtén todas las facturas registradas
    facturas = Factura.objects.all()
    return render(request, 'accounts/Factura.html', {'facturas': facturas})

# def listar_facturas(request):
#     facturas = Factura.objects.all()
#     return render(request, 'accounts/Facturas.html', {'facturas': facturas})

def crear_factura(request):
    if request.method == 'POST':
        form = FacturaForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('factura')
    else:
        form = FacturaForm()
    return render(request, 'accounts/crear_factura.html', {'form': form})

from .forms import FacturaForm

def editar_factura(request, numero_factura):
    # Obtén la factura correspondiente al número
    factura = get_object_or_404(Factura, numero_factura=numero_factura)

    if request.method == 'POST':
        form = FacturaForm(request.POST, request.FILES, instance=factura)
        if form.is_valid():
            form.save()
            return redirect('factura')  # Redirige a la lista de facturas
    else:
        form = FacturaForm(instance=factura)

    return render(request, 'accounts/editar_factura.html', {'form': form, 'factura': factura})

def inhabilitar_factura(request, numero_factura):
    factura = get_object_or_404(Factura, numero_factura=numero_factura)
    factura.habilitada = False
    factura.save()
    return redirect('factura')

def habilitar_factura(request, numero_factura):
    factura = get_object_or_404(Factura, numero_factura=numero_factura)
    factura.habilitada = True
    factura.save()
    return redirect('factura')

# ------------------------
# LISTADO DEL INVENTARIO EDITAR Y ELIMINAR PRODUCTOS
# ------------------------
def editar_inven(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == "POST":
        form = ProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():
            form.save()
            return redirect('inventario')
    else:
        form = ProductoForm(instance=producto)
    return render(request, 'accounts/editarinve.html', {'form': form})

def eliminar_inven(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == "POST":
        producto.delete()
        return redirect('inventario')
    return render(request, 'accounts/confirmar_eliminar.html', {'producto': producto})




# vitas para las copias de seguridad 
import os
from django.http import HttpResponse, Http404
from django.shortcuts import render, redirect
from django.conf import settings
from datetime import datetime

# Ruta donde se almacenarán las copias de seguridad
BACKUP_DIR = os.path.join(settings.BASE_DIR, 'backups')

def crear_copia_seguridad(request):
    if request.method == 'POST':
        if not os.path.exists(BACKUP_DIR):
            os.makedirs(BACKUP_DIR)
        backup_name = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
        backup_path = os.path.join(BACKUP_DIR, backup_name)
        os.system(f"mysqldump -u root  mercapp > {backup_path}")
        return redirect('copias_seguridad')

def listar_copias_seguridad(request):
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    backups = [
        {'id': i, 'name': f, 'created_at': datetime.fromtimestamp(os.path.getctime(os.path.join(BACKUP_DIR, f))).strftime('%Y-%m-%d %H:%M:%S')}
        for i, f in enumerate(os.listdir(BACKUP_DIR))
    ]
    return render(request, 'accounts/Copias_seguidad.html', {'backups': backups})

def descargar_copia_seguridad(request, backup_id):
    try:
        backups = os.listdir(BACKUP_DIR)
        backup_file = backups[int(backup_id)]
        backup_path = os.path.join(BACKUP_DIR, backup_file)
        with open(backup_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{backup_file}"'
            return response
    except (IndexError, FileNotFoundError):
        raise Http404("Copia de seguridad no encontrada.")

def eliminar_copia_seguridad(request, backup_id):
    try:
        backups = os.listdir(BACKUP_DIR)
        backup_file = backups[int(backup_id)]
        backup_path = os.path.join(BACKUP_DIR, backup_file)
        os.remove(backup_path)
        return redirect('copias_seguridad')
    except (IndexError, FileNotFoundError):
        raise Http404("Copia de seguridad no encontrada.")

# Ruta donde se almacenan las copias de seguridad
BACKUP_DIR = os.path.join(settings.BASE_DIR, 'backups')

import subprocess
import subprocess
import os
from django.http import HttpResponse, Http404

BACKUP_DIR = os.path.join("C:", "Users", "milen", "OneDrive", "Desktop", "MercApp", "backups")

def restaurar_copia_seguridad(request, backup_id):
    if request.method == 'GET':
        try:
            # Lista los archivos de respaldo
            backups = os.listdir(BACKUP_DIR)
            backup_file = backups[int(backup_id)]
            backup_path = os.path.join(BACKUP_DIR, backup_file)

            # Verifica si el archivo existe
            if not os.path.exists(backup_path):
                return HttpResponse("El archivo de respaldo no existe.", status=404)

            # Comando para restaurar la base de datos
            mysql_executable = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
            command = f"\"{mysql_executable}\" -u root -p[] mercapp < \"{backup_path}\""
            result = subprocess.run(command, shell=True, capture_output=True, text=True)

            # Manejo de errores en el comando
            if result.returncode != 0:
                print(f"Error al restaurar la base de datos: {result.stderr}")
                return HttpResponse(f"Error al restaurar la base de datos: {result.stderr}", status=500)

            return redirect('copias_seguridad')
        except (IndexError, FileNotFoundError):
            raise Http404("Copia de seguridad no encontrada.")
    else:
        return HttpResponse("Método no permitido", status=405)
 
# ---------------------------------
# VISTA PARA LA RECUPERACION DE CONTRASEÑA
# ---------------------------------




def recu_contra(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            messages.error(request, "El correo ingresado no está registrado.")
            return render(request, 'accounts/recuperar_contraseña.html')
        
        recovery_email = user.email

        signer = TimestampSigner()
        token = signer.sign(str(user.pk))
        
        reset_url = request.build_absolute_uri(reverse('cambia_con', args=[token]))
        
        html_message = render_to_string('accounts/msg_correo.html', {
            'username': user.username,  
            'reset_url': reset_url,       
            'site_name': 'MERCAPP',
        })
        
        subject = "Recuperación de contraseña"
        text_message = strip_tags(html_message)
        
        try:
            email = EmailMultiAlternatives(
                subject=subject,                      
                body=text_message,                     
                from_email=settings.DEFAULT_FROM_EMAIL, 
                to=[recovery_email]                     
            )
            email.encoding = 'utf-8'
            email.send()
            messages.success(request, "Este enlace tiene una duracion de 1h.")
            return redirect("login")
        except Exception as e:
            messages.error(request, f"Error al enviar el correo: {str(e)}")
            return render(request, 'accounts/recuperar_contraseña.html')
        
    return render(request, 'accounts/recuperar_contraseña.html')


from django.contrib.auth.password_validation import validate_password

def cambia_con(request, token):
    signer = TimestampSigner()
    try:
        user_id = signer.unsign(token, max_age=3600)
        usuario = get_object_or_404(CustomUser, pk=user_id)
    except (BadSignature, SignatureExpired):
        messages.error(request, "El enlace de recuperación es inválido o ha expirado.")
        return redirect("recuperar_contraseña")
    
    if request.method == 'POST':
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')
        
        if not new_password or not confirm_password:
            messages.error(request, "Todos los campos son obligatorios.")
            return render(request, 'accounts/cambia_contraseña.html')

        if new_password != confirm_password:
            messages.error(request, "Las contraseñas no coinciden.")
            return render(request, 'accounts/cambia_contraseña.html')

        try:
            validate_password(new_password, usuario)  # Valida la contraseña
        except ValidationError as e:
            messages.error(request, e.messages[0])  # Muestra el primer error
            return render(request, 'accounts/cambia_contraseña.html')

        usuario.password = make_password(new_password)
        usuario.save()
        
        messages.success(request, "La contraseña se ha cambiado correctamente.")
        return redirect("login")
    
    return render(request, 'accounts/cambia_contraseña.html')