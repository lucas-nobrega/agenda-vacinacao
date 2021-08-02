import api from './api'

const agendamentoVacinacaoService = {
   async getAgendamentoVacinacao(id) {
      return api.get('agendamento-vacinacao/' + id)
         .then(response => response)
   },
   async getAgendamentosVacinacao() {
      const response = await api.get('agendamento-vacinacao/', { params: { format: "json"}});
      return response;
   },
   async deletarAgendamentoVacinacao(id) {
      return api.delete('agendamento-vacinacao/' + id)
         .then(response => response)
   },  
   async cadastroAgendamentoVacinacao(dados_cadastrais) {
      return api.post('agendamento-vacinacao/', dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   },
   async editarAgendamentoVacinacao(dados_cadastrais, id) {
      return api.put('agendamento-vacinacao/' + id +"/", dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   }
}

export default agendamentoVacinacaoService

 