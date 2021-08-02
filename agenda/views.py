from django.contrib.auth.models import User
from django.shortcuts import render

from django.http import HttpResponse
from agenda.models import GrupoAtendimento, LocalVacinacao, AgendamentoVacinacao, Cidadao
from agenda.serializers import GrupoAtendimentoSerializer, LocalVacinacaoSerializer, AgendamentoVacinacaoSerializer, CidadaoSerializer
from rest_framework.response import Response
from rest_framework import status
from datetime import date

from rest_framework import viewsets
from rest_framework import permissions

import logging

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'index.html')


class CidadaoViewSet(viewsets.ModelViewSet):
    #pagination_class = None
    queryset = Cidadao.objects.all()
    serializer_class = CidadaoSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class GrupoAtendimentoViewSet(viewsets.ModelViewSet):
    pagination_class = None
    queryset = GrupoAtendimento.objects.all()
    serializer_class = GrupoAtendimentoSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class LocalVacinacaoViewSet(viewsets.ModelViewSet):
    #pagination_class = None
    queryset = LocalVacinacao.objects.all()
    serializer_class = LocalVacinacaoSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]



class AgendamentoVacinacaoViewSet(viewsets.ModelViewSet):
    #pagination_class = None
    #queryset = AgendamentoVacinacao.objects.all()
    serializer_class = AgendamentoVacinacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):

        queryset = AgendamentoVacinacao.objects.all()
        #logger.warning(queryset)
        return queryset

    def create(self, request, *args, **kwargs):  # Sobrescreve o create do CRUD
        usuario = request.user
        agendamento = AgendamentoVacinacao()
        #logger.warning("-------------TESTE-------------")
        #queryset = self.get_queryset()
        #logger.warning(queryset)
        cidadao = Cidadao.objects.get(
            cidadao_id=request.data.get('cidadao_id'))
        born = cidadao.data_nascimento
        today = date.today()   
        idade_cidadao = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        #logger.warning(idade_cidadao)

        agendamento.hora = request.data.get('hora') # dados do JSON recebido
        agendamento.data = request.data.get('data')
        #idade = request.data.get('cidadao_id')
        agendamento.idade = idade_cidadao
        agendamento.status = request.data.get('status')
        agendamento.local_vacinacao = LocalVacinacao.objects.get(
            cod_cnes=request.data.get('local_vacinacao_id'))
        agendamento.cidadao = Cidadao.objects.get(
            cidadao_id=request.data.get('cidadao_id'))
        agendamento.grupo_atendimento = GrupoAtendimento.objects.get(
            grupo_id=request.data.get('grupo_atendimento_id'))
        agendamento.save()
        # verificar todos os agendamentos de um usuario se a quantidade de status agendado <= 1? + vacinado <=? > 2
        serializer = AgendamentoVacinacaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CidadaoAgendamentoViewSet(viewsets.ModelViewSet):
    #pagination_class = None
    #queryset = Cidadao.objects.all()
    serializer_class = AgendamentoVacinacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        #queryset = AgendamentoVacinacao.objects.all()
        #logger.warning(queryset)
        cidadao_id = self.request.query_params.get('cidadao_id')
        agendamentos = AgendamentoVacinacao.objects.all().filter(cidadao_id=cidadao_id)
        return agendamentos
        





class LocalVacinacaoProximoViewSet(viewsets.ModelViewSet):
    serializer_class = LocalVacinacaoSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    def get_queryset(self):
        latitude = float(self.request.query_params.get('latitude'))
        longitude = float(self.request.query_params.get('longitude'))
        proximidade = float(self.request.query_params.get('proximidade'))

        distancia = proximidade/111

        return LocalVacinacao.objects.all().filter(
            vlr_latitude__gte=(latitude-distancia), vlr_latitude__lte=(latitude+distancia)).filter(
            vlr_longitude__gte=(longitude-distancia), vlr_longitude__lte=(longitude+distancia))
       
