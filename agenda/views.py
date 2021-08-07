
from django.db.models.aggregates import Count
from django.shortcuts import render
from agenda.models import GrupoAtendimento, LocalVacinacao, AgendamentoVacinacao, Cidadao
from agenda.serializers import GrupoAtendimentoSerializer, LocalVacinacaoSerializer, AgendamentoVacinacaoSerializer, CidadaoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import serializers
from django.db.models import Q

from rest_framework import viewsets
from rest_framework import permissions

import logging

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'index.html')


class CidadaoViewSet(viewsets.ModelViewSet):
    # pagination_class = None
    queryset = Cidadao.objects.all()
    serializer_class = CidadaoSerializer
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        logger.warning(request.data)
        serializer = CidadaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GrupoAtendimentoViewSet(viewsets.ModelViewSet):
    pagination_class = None
    queryset = GrupoAtendimento.objects.all()
    serializer_class = GrupoAtendimentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
         if (self.action == 'update' or self.action == 'create'):
            permission_classes = [permissions.IsAdminUser]
         else:
            permission_classes = [permissions.IsAuthenticated]
         return [permission() for permission in permission_classes]


class LocalVacinacaoViewSet(viewsets.ModelViewSet):
    # pagination_class = None
    queryset = LocalVacinacao.objects.all()
    serializer_class = LocalVacinacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
         if (self.action == 'update' or self.action == 'create'):
            permission_classes = [permissions.IsAdminUser]
         else:
            permission_classes = [permissions.IsAuthenticated]
         return [permission() for permission in permission_classes]


class AgendamentoVacinacaoViewSet(viewsets.ModelViewSet):
    # pagination_class = None
    # queryset = AgendamentoVacinacao.objects.all()
    serializer_class = AgendamentoVacinacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if(self.request.user.is_staff):
            queryset = AgendamentoVacinacao.objects.all()
        else:
            cidadao = Cidadao.objects.filter(user=self.request.user)[0]
            queryset = AgendamentoVacinacao.objects.filter(cidadao=cidadao)

        return queryset

    def get_permissions(self):
      if self.action == 'estatistica':
         permission_classes = [permissions.AllowAny]
      else:
         permission_classes = [permissions.IsAuthenticated]
      return [permission() for permission in permission_classes]

    @action(detail=True, methods=['POST'], name='Cancelar Agendamento')
    def cancelar(self, request, pk=None):
        try:
            uuid = serializers.UUIDField().to_internal_value(data=pk)
            try:
                agendamento = AgendamentoVacinacao.objects.get(pk=pk)
                if((agendamento.cidadao.user != request.user)):
                   if(request.user.is_staff == False):
                     return Response({
                           "resultado":  "erro",
                           "motivo": "O agendamento não pertence ao usuário logado ou o usuário não é admin"
                     })
                   else:
                     agendamento.status = AgendamentoVacinacao.opcoes.CANCELADO
                     agendamento.save()
                     return Response({"resultado":  "sucesso"})

                elif(agendamento.status == AgendamentoVacinacao.opcoes.CANCELADO):
                    return Response({
                        "resultado":  "erro",
                        "motivo": "O agendamento já está cancelado"
                    })
                elif(agendamento.status == AgendamentoVacinacao.opcoes.VACINADO):
                    return Response({
                        "resultado":  "erro",
                        "motivo": "A vacinação já ocorreu"
                    })
                else:
                    agendamento.status = AgendamentoVacinacao.opcoes.CANCELADO
                    agendamento.save()
                    return Response({"resultado":  "sucesso"})

            except AgendamentoVacinacao.DoesNotExist:
                return Response({
                    "resultado":  "erro",
                    "motivo": "O agendamento não foi encontrado"
                })
        except:
            return Response({
                "resultado":  "erro",
                "motivo": "O código do agendamento não é válido: " + pk
            })

    @action(detail=True, methods=['POST'], name='Cadastrar Vacinacao')
    def vacinar(self, request, pk=None):
       try:
            uuid = serializers.UUIDField().to_internal_value(data=pk)
            try:
               agendamento = AgendamentoVacinacao.objects.get(pk=pk)

               if(request.user.is_staff == False):
                  return Response({
                        "resultado":  "erro",
                        "motivo": "Somento administradores podem cadastrar como vacinado"
                  })
               else:
                  agendamento.status = AgendamentoVacinacao.opcoes.VACINADO
                  agendamento.save()
                  return Response({"resultado":  "sucesso"})

            except AgendamentoVacinacao.DoesNotExist:
                return Response({
                    "resultado":  "erro",
                    "motivo": "O agendamento não foi encontrado"
                })

       except:
            return Response({
                "resultado":  "erro",
                "motivo": "O código do agendamento não é válido: " + pk
            })

    @action(detail=False, methods=['get'], name="Gerar Estatistica")
    def estatistica(self, request):
         agendados = AgendamentoVacinacao.objects.filter(status=1).aggregate(Count('agendamento_id'))["agendamento_id__count"]
         cancelados = AgendamentoVacinacao.objects.filter(status=2).aggregate(Count('agendamento_id'))["agendamento_id__count"]
         vacinados = AgendamentoVacinacao.objects.filter(status=3).aggregate(Count('agendamento_id'))["agendamento_id__count"]
         return Response({"agendados" : agendados, "cancelados" : cancelados, "vacinados" : vacinados})
         


class CidadaoAgendamentoViewSet(viewsets.ModelViewSet):
    # pagination_class = None
    # queryset = Cidadao.objects.all()
    serializer_class = AgendamentoVacinacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # queryset = AgendamentoVacinacao.objects.all()
        # logger.warning(queryset)
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
