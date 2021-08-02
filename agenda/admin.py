from django.contrib import admin

# Register your models here.
from .models import Cidadao, GrupoAtendimento, LocalVacinacao, AgendamentoVacinacao

admin.site.register(GrupoAtendimento)
admin.site.register(LocalVacinacao)
admin.site.register(AgendamentoVacinacao)
admin.site.register(Cidadao)
