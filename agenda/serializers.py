from users.models import User
from rest_framework import serializers
from agenda.models import GrupoAtendimento
from agenda.models import LocalVacinacao
from agenda.models import AgendamentoVacinacao
from agenda.models import Cidadao
from datetime import date
from django.db.models import Q


class CidadaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cidadao
        fields = ['cidadao_id', 'user', 'nome_completo',
                  'data_nascimento', 'data_cadastro']


class GrupoAtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoAtendimento
        fields = ['grupo_id', 'nome', 'idade_minima']


class LocalVacinacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalVacinacao
        fields = ['cod_cnes', 'cod_munic', 'nom_estab', 'dsc_endereco',
                  'dsc_bairro', 'dsc_cidade', 'vlr_longitude', 'vlr_latitude']


class AgendamentoVacinacaoSerializer(serializers.ModelSerializer):
    idade = serializers.IntegerField(read_only=True)

    class Meta:
        model = AgendamentoVacinacao
        depth = 1
        fields = ['status', 'agendamento_id', 'hora', 'data', 'idade',
                  'data_cadastro', 'grupo_atendimento', 'local_vacinacao', 'cidadao']

    def __init__(self, *args, **kwargs):
      super(AgendamentoVacinacaoSerializer, self).__init__(*args, **kwargs)
      request = self.context.get('request')
      if request and (request.method == 'POST' or request.method == 'PUT'):
         self.Meta.depth = 0
      else:
         self.Meta.depth = 1

    def create(self, validated_data):
        # Verifica se tem agendamentos não cancelados
        agendamentos = AgendamentoVacinacao.objects.filter(Q(cidadao=validated_data["cidadao"]) & (~Q(status=AgendamentoVacinacao.opcoes.CANCELADO) | Q(status=AgendamentoVacinacao.opcoes.VACINADO)))
        if(agendamentos.count()>0):
            raise serializers.ValidationError({"erro": "o cidadão possui agendamentos não cancelados ou já vacinado"})

        born = validated_data["cidadao"].data_nascimento
        today = date.today()
        idade_cidadao = today.year - born.year - \
            ((today.month, today.day) < (born.month, born.day))
        validated_data["idade"] = idade_cidadao
        return super(AgendamentoVacinacaoSerializer, self).create(validated_data)

        #raise serializers.ValidationError("Não pode fazer mais de um agendamento")
