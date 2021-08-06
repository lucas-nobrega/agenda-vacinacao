from django.db import models
from users.models import User
import uuid


class Cidadao(models.Model):
    cidadao_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.PROTECT)
    nome_completo = models.CharField(max_length=254,  null=True)
    data_nascimento = models.DateField(null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_completo} - {self.user.email}"


class GrupoAtendimento(models.Model):
    grupo_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    idade_minima = models.IntegerField()

    def __str__(self):
        return f"{self.nome} - Idade mínima: {self.idade_minima}"


class LocalVacinacao(models.Model):
    vlr_latitude = models.FloatField()
    vlr_longitude = models.FloatField()
    cod_munic = models.CharField(max_length=255)
    cod_cnes = models.CharField(max_length=255, primary_key=True)
    nom_estab = models.CharField(max_length=255)
    dsc_endereco = models.CharField(max_length=255)
    dsc_bairro = models.CharField(max_length=255)
    dsc_cidade = models.CharField(max_length=255)
   # dsc_telefone = models.CharField(max_length=255)
   # dsc_estrut_fisic_ambiencia = models.CharField(max_length=255)
   # dsc_adap_defic_fisic_idosos = models.CharField(max_length=255)
   # dsc_equipamentos = models.CharField(max_length=255)
   # dsc_medicamentos = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nom_estab}"


class AgendamentoVacinacao(models.Model):

    class opcoes(models.IntegerChoices):
        AGENDADO = 1
        CANCELADO = 2
        VACINADO = 3
    status = models.IntegerField(default=1, choices=opcoes.choices)

    agendamento_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    hora = models.TimeField()
    data = models.DateField()
    idade = models.IntegerField()
    data_cadastro = models.DateTimeField(auto_now_add=True)
    grupo_atendimento = models.ForeignKey(
        GrupoAtendimento, on_delete=models.PROTECT)
    local_vacinacao = models.ForeignKey(
        LocalVacinacao, on_delete=models.PROTECT)
    cidadao = models.ForeignKey(
        Cidadao, on_delete=models.PROTECT)

    def __str__(self) -> str:
        return f"{self.cidadao.nome_completo} ({self.cidadao.user.email}) - {self.data} - {self.hora} - {self.get_status_display()}"
