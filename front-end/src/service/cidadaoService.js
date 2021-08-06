import api from './api'

/* export default {
   getCidadao(id) {
      return api.get('cidadao/' + id)
         .then(response => response.data)
   },
   getCidadaos() {
      return api.get('cidadao/', { params: { format: "json", page: paginaAtual}})
         .then(response => response.data)
   },
   cadastro(dados_cadastrais) {
      return api.put('cidadao/' + dados_cadastrais.id, dados_cadastrais)
         .then(response => response.data)
   },
   getCidadaosCount() {
      return api.get('cidadao/cidadaoscount')
         .then(response => response.data)
   },
   cadastroCidadao(dados_cadastrais) {
      return api.post('cidadao', dados_cadastrais)
         .then(response => response.data)
   }
}*/

const cidadaoService = {
   async getCidadaos(paginaAtual) {
      const response = await api.get('cidadao/', { params: { format: "json", page: paginaAtual}});
      return response;
   },
   async getCidadao(id) {
      return api.get('cidadao/' + id)
         .then(response => response)
   },
   async deletarCidadao(id) {
      return api.delete('cidadao/' + id + "/")
         .then(response => response)
   },  
   async editarCidadao(dados_cadastrais, id) {
      return api.put('cidadao/' + id +"/", dados_cadastrais)
         .then(response => response)
         .catch(err =>{
            return {"resultado" : "erro", "motivo" : "Erro ao requisitar os dados"};
          }
         )
   }
}

export default cidadaoService