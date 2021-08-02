import axios from 'axios'

function getRefreshToken() {
   return localStorage.getItem("jwt") != null ? JSON.parse(localStorage.getItem("jwt")).refresh : null
}

function getAccessToken() {
   return localStorage.getItem("jwt") != null ? JSON.parse(localStorage.getItem("jwt")).access : null
}

function saveToken(dados) {
   const jwt = {
      "access" : dados.access,
      "refresh" : JSON.parse(localStorage.getItem("jwt")).refresh, 
      "id" : JSON.parse(localStorage.getItem("jwt")).refresh
   }
   localStorage.setItem("jwt", JSON.stringify(jwt));
}

async function atualizaToken(error) {
   return new Promise((resolve, reject) => {
     try {
       axios
         .post("/api/token/refresh/", {"refresh" : getRefreshToken()}, { headers: {
            'Content-Type': 'application/json'}} )
         .then(async (res) => {
            saveToken(res.data);
           return resolve(res);
         })
         .catch((err) => {
           return reject(error);
         });
     } catch (err) {
       return reject(err);
     }
   });
 };

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : localStorage.getItem("jwt") != null ? 'Bearer ' + JSON.parse(localStorage.getItem("jwt")).access : null
  }
});

api.interceptors.response.use(
   (response) => {
      console.info("Interceptando response")
     return response;
   },
   async function (error) {
     const access_token = getAccessToken();
     if (error.response.status === 401 && access_token) {
       const response = await atualizaToken(error);
       return response;
     }
     return Promise.reject(error);
   }
 );

export default api

