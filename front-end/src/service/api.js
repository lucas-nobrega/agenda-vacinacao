import axios from 'axios'
import Cookies from 'js-cookie'
import createAuthRefreshInterceptor from 'axios-auth-refresh';

function getRefreshToken() {
   return localStorage.getItem("jwt") != null ? JSON.parse(localStorage.getItem("jwt")).refresh : null
}

function getAccessToken() {
   return localStorage.getItem("jwt") != null ? JSON.parse(localStorage.getItem("jwt")).access : null
}

// Fazer o refresh do token
const refreshAuthLogic = failedRequest => axios.post("/api/token/refresh/", { "refresh": getRefreshToken() }, {
   headers: {
      'Content-Type': 'application/json'
   }
}).then(async (res) => {
   saveToken(res.data);
   failedRequest.response.config.headers['Authorization'] = 'Bearer ' + res.data.access;
   return Promise.resolve();
});

function saveToken(dados) {
   const jwt = {
      "access": dados.access,
      "refresh": JSON.parse(localStorage.getItem("jwt")).refresh,
      "id": JSON.parse(localStorage.getItem("jwt")).refresh
   }
   localStorage.setItem("jwt", JSON.stringify(jwt));
}

const api = axios.create({
   baseURL: '/api/v1',
   timeout: 5000,
   headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    //  'Authorization': getAccessToken() != null ? 'Bearer ' + getAccessToken() : null
   }
});

api.interceptors.request.use(function (config) {
   
   let accessToken = getAccessToken();
   if(accessToken !== null) {
      config.headers.Authorization =  'Bearer ' + accessToken;
   }

   return config;
});

createAuthRefreshInterceptor(api, refreshAuthLogic);

export default api

