import api from './api'

const usuarioService = {
    login(credenciais) {
      return api.post('api/token/', credenciais, {baseURL : "/"})
            .then(response => response)
    },
    verLogin() {
        return api.get('api/verlogin/',  {baseURL : "/"})
            .then(response => response)
    },
    logout(refresh_token) {
      return api.post('api/logout/', {"refresh_token" : refresh_token}, {baseURL : "/"})
            .then(response => response)
    },
    async cadastroUsuario(dados_cadastrais) {
      return api.post('cadastro/', dados_cadastrais,  {baseURL : "/"})
         .then(response => response)
         .catch(err =>{
            let respostaErro = {};
            if(err.response.status===400) {
               return err.response;
            } else {
               respostaErro = {
                  "Erro ao requisitar os dados" : ["problemas no servidor"]
               }
            }
            return {"status" : err.response.status, "data" : respostaErro};
          }
         )
   }/*,
   async editarCidadao(dados_cadastrais, id) {
      return api.put('user/'+ id +"/", dados_cadastrais,  {baseURL : "/"})
         .then(response => response)
         .catch(err =>{
            let respostaErro = {};
            if(err.response.status===400) {
               return err.response;
            } else {
               respostaErro = {
                  "Erro ao alterar os dados" : ["problemas no servidor"]
               }
            }
            return {"status" : err.response.status, "data" : respostaErro};
          }
         )
   },
   async deletarCidadao(id) {
      return api.delete('user/' + id, {baseURL : "/"})
      .then(response => response)
      .catch(err =>{
         let respostaErro = {};
         if(err.response.status===400) {
            return err.response;
         } else {
            respostaErro = {
               "Erro ao alterar os dados" : ["problemas no servidor"]
            }
         }
         return {"status" : err.response.status, "data" : respostaErro};
       }
      )
   }, */

}

export default usuarioService;