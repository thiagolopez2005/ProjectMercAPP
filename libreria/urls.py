from django.urls import path
from .views import register_view, login_view, dashboard_view, logout_view , register_cliente_view, login_cliente_view, crear_producto
from . import views

urlpatterns = [
    # URLS DE LAS VISTAS PRINCIPALES
    
    path('', views.Principal, name='Principal'),
    path('productos/', views.productos, name='Productos'),
    path('nosotros/', views.Nosotros, name='Nosotros'),
    path('servicios/', views.Servicios, name='Servicios'),
    path('carrito/', views.carrito, name='Carrito'),
    
    # URLS DE LA SVISTAS DE LOGEO Y REGISTRO
    
    path('login_cliente/', login_cliente_view, name='login_cliente'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register_cliente/', register_cliente_view, name='register_cliente'),
    path('accounts/registro/', register_view, name='register'),
    
    # URLS DE LAS VISTAS DE ADMINISTRACION Y EMPLEADOS
    
    path('inventario/', views.inventario, name='inventario'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('empleado/', views.vista_emple, name='vista_emple'),

    # URLS DE LAS VISTAS DE ADMINISTRACION DE CUENTAS DE MERCAPP
    
    # path('listar-registros/', views.listar_registros, name='listar_registros'),
    path('editar-cuenta/<int:id>/', views.editar_cuenta, name='editar_cuenta'),
    path('activar-cuenta/<int:id>/', views.activar_cuenta, name='activar_cuenta'),
    path('desactivar-cuenta/<int:id>/', views.desactivar_cuenta, name='desactivar_cuenta'),
    path('eliminar-cuenta/<int:id>/', views.eliminar_cuenta, name='eliminar_cuenta'),
    
    # URLS DE LAS VISTAS DE ADMINISTRACION DE PRODUCTOS
    
    path('index/', views.index, name='index'),
    path('obtener_productos_json/', views.obtener_productos_json, name='obtener_productos_json'),
    path('editar_producto/<int:producto_id>/', views.editar_producto, name='editar_producto'),
    path('eliminar/<int:producto_id>/', views.eliminar_producto, name='confirmar_eliminar'),
    path('subir_imagen/', views.subir_imagen, name='subir_imagen'),
    path('quitar_publicidad/<int:productoId>/', views.quitar_publicidad, name='quitar_publicidad'),
    path('publicar_producto/<int:productoId>/', views.publicar_producto, name='publicar_producto'),
    path('productos2/', views.productos2, name='productos2'), # URL PARA LA VISTA DE PRODUCTOS EN EL PANEL DE CONTROL PARA PUBLICAR UN PRODUCTO
    path('obtener_productos_json/', views.obtener_productos_json, name='obtener_productos_json'),  # URL para la vista JSON
    path('crear_producto/', crear_producto, name='crear_producto'),
    
    # URLS  DE LAS VISTAS DE ADMINISTRACION DE FACTURAS
    path('Factura/', views.factura, name='factura'),
    path('editar_factura/<int:numero_factura>/', views.editar_factura, name='editar_factura'),
    path('crear_factura/', views.crear_factura, name='crear_factura'),
    path('inhabilitar_factura/<int:numero_factura>/', views.inhabilitar_factura, name='inhabilitar_factura'),
    path('habilitar/<int:numero_factura>/', views.habilitar_factura, name='habilitar_factura'),

    # URLS DE LAS VISTAS DE ADMINISTRACION DE PROVEEDORES
    path('registrar_proveedor/', views.registrar_proveedor, name='registrar_proveedor'),
    path('inhabilitar_proveedor/<int:id>/', views.inhabilitar_proveedor, name='inhabilitar_proveedor'),
    path('habilitar_proveedor/<int:id>/', views.habilitar_proveedor, name='habilitar_proveedor'),
    path('editar_proveedor/<int:id>/', views.editar_proveedor, name='editar_proveedor'),
    
    # urls para el invetatio
    path('editar_inventario/<int:productoId>', views.editar_inven, name='editarinve'),
    
    
    # URLS PARA LAS COPIAS DE SEGUIDAD
    path('copias_seguridad/', views.listar_copias_seguridad, name='copias_seguridad'),
    path('crear_copia_seguridad/', views.crear_copia_seguridad, name='crear_copia_seguridad'),
    path('descargar_copia_seguridad/<int:backup_id>/', views.descargar_copia_seguridad, name='descargar_copia_seguridad'),
    path('eliminar_copia_seguridad/<int:backup_id>/', views.eliminar_copia_seguridad, name='eliminar_copia_seguridad'),
    path('restaurar_copia_seguridad/<int:backup_id>/', views.restaurar_copia_seguridad, name='restaurar_copia_seguridad'),
    
    path('cambia_contraseña/<str:token>/', views.cambia_con, name='cambia_con'), #vista para cambiar contraseña con token, en name se le pasa el token para contsruir la url
    path('recuperar_contraseña/', views.recu_contra, name="recu_contra"), #vista para recuperar contraseña

]