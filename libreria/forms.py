from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, CustomCliente
from .models import Producto

class CustomUserCreationForm(UserCreationForm):
    role = forms.ChoiceField(choices=CustomUser.ROLE_CHOICES, required=True)
    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ('nombre','apellido' ,'cec' ,'email', 'telefono', 'role','password1', 'password2')
        
class CustomClienteCreationForm(UserCreationForm):
    class Meta:
        model = CustomCliente  # Asegúrate de usar el modelo correcto
        fields = ('nombre','apellido', 'CC', 'email', 'telefono', 'roleCliente', 'password1', 'password2')
        
        
class CustomAuthenticationForm(AuthenticationForm):
    # Incluimos el campo de rol para que el usuario lo seleccione al iniciar sesión
    role = forms.ChoiceField(choices=CustomUser.ROLE_CHOICES, required=True)

# AQUI DEFINIMOS LOS OBJETOS O ATRIBUTOS PARA LA CREACION DE PRODUCTOS EN EL PANEL DE CONTROL
class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['imagen', 'nombre', 'descripcion', 'origen', 'unidad', 'stock', 'precio', 'publicado', 'medida', 'tipoproducto']  # Incluye tipoproducto        

# AQUI DEFINIMOS LOS ATRIBUSTOS QUE APARECEREAN PARA LA ACTIVACION Y DESACTIVACION DE CUENTAS EN EL PANEL DE CONTROL
from django.contrib.auth.forms import UserChangeForm
class CustomUserChangeForm(UserChangeForm):
    password = None
    class Meta:
        model = CustomUser
        fields = ('nombre','apellido', 'cec', 'email', 'telefono', 'role', 'is_active') #Se corrige aqui.
        
        
        
# ------- FACTURA -------
from django import forms
from .models import Factura

class FacturaForm(forms.ModelForm):
    class Meta:
        model = Factura
        fields = ['imagen', 'descripcion', 'fecha_publicacion']
        def __init__(self, *args, **kwargs):
            super(FacturaForm, self).__init__(*args, **kwargs)
            self.fields['descripcion'].widget.attrs.update({'class': 'form-control'})
            self.fields['fecha_publicacion'].widget.attrs.update({'class': 'form-control'})
            self.fields['imagen'].widget.attrs.update({'class': 'form-control'})

# ------------------ PROVEEDORES-------------------------
from django import forms
from .models import Proveedor

class ProveedorForm(forms.ModelForm):
    class Meta:
        model = Proveedor
        fields = ['nombre', 'apellido', 'telefono', 'correo', 'activo']

    def __init__(self, *args, **kwargs):
        super(ProveedorForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})