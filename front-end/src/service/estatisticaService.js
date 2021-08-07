import api from '../service/api'

const grupoAtendimentoService = {
   async getGrupoAtendinento(id) {
      return api.get('grupo-atendimento/' + id)
         .then(response => response)
   },
   async getEstatisticas() {
      const response = await api.get('/agendamento-vacinacao/estatistica', { params: { format: "json"}});
      return response;
   }/* ,
   async deletarGrupoAtendinento(id) {
      return api.delete('grupo-atendimento/' + id)
         .then(response => response)
   },  
   async cadastroGrupoAtendinento(dados_cadastrais) {
      return api.post('grupo-atendimento/', dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   },
   async editarGrupoAtendinento(dados_cadastrais, id) {
      return api.put('grupo-atendimento/' + id +"/", dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   } */
}

export default grupoAtendimentoService

 