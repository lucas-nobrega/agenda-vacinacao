import api from './api'

const localVacinacaoService = {
   async getLocalVacinacao(id) {
      return api.get('local-vacinacao/' + id)
         .then(response => response)
   },
   async getLocaisVacinacao(paginaAtual) {
      const response = await api.get('local-vacinacao/', { params: { format: "json", page: paginaAtual}});
      return response;
   },
   async getLocaisVacinacaoProximos(latitude, longitude, proximidade) {
      const response = await api.get('local-vacinacao-proximos/?latitude=' + latitude + '&longitude=' + longitude + '&proximidade=' + proximidade);
      return response;
   },

   async deletarLocalVacinacao(id) {
      return api.delete('local-vacinacao/' + id)
         .then(response => response)
   },  
   async cadastroLocalVacinacao(dados_cadastrais) {
      return api.post('local-vacinacao/', dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   },
   async editarLocalVacinacao(dados_cadastrais, id) {
      return api.put('local-vacinacao/' + id +"/", dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   }
}

export default localVacinacaoService

 