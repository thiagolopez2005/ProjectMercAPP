from django.contrib.auth.backends import BaseBackend
from .models import CustomCliente

class CustomClienteBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Busca al cliente por el campo USERNAME_FIELD (CC)
            cliente = CustomCliente.objects.get(CC=username)
            if cliente.check_password(password):  # Verifica la contraseña
                return cliente
        except CustomCliente.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomCliente.objects.get(pk=user_id)
        except CustomCliente.DoesNotExist:
            return None