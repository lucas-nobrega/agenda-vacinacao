from users.models import User
from rest_framework import serializers
from agenda.models import GrupoAtendimento
from agenda.models import LocalVacinacao
from agenda.models import AgendamentoVacinacao
from agenda.models import Cidadao


class CidadaoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cidadao
        fields = ['cidadao_id', 'user', 'nome_completo', 'data_nascimento', 'data_cadastro']

class GrupoAtendimentoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GrupoAtendimento
        fields = ['grupo_id', 'nome', 'idade_minima']

class LocalVacinacaoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LocalVacinacao
        fields = [ 'cod_cnes', 'cod_munic','nom_estab', 'dsc_endereco', 'dsc_bairro', 'dsc_cidade', 'vlr_longitude', 'vlr_latitude']

class AgendamentoVacinacaoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AgendamentoVacinacao
        fields = ['agendamento_id', 'hora', 'data','grupo_atendimento_id','local_vacinacao_id','data_cadastro', 'cidadao_id', 'status']



