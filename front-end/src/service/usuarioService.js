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
    }
}

export default usuarioService;