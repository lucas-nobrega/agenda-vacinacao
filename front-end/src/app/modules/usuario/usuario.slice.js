import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usuarioService from './../../../service/usuarioService';


export const loginAction = createAsyncThunk(
   "usuario/login",
   (credenciais, { getState }) => {
      return usuarioService.login(credenciais);
   }
);

export const verLoginAction = createAsyncThunk(
   "usuario/verlogin",
   () => {
         return usuarioService.verLogin();
   }
);

export const logoutAction = createAsyncThunk(
   "usuario/logout",
   () => {
      console.info("chamando logout");
      return usuarioService.logout(localStorage.getItem("jwt") != null ? JSON.parse(localStorage.getItem("jwt")).refresh : null);
   }
);

// (success | error | warning | info) Para usar com o componente Alert
export const tiposMensagens = {
   'SUCESSO': 'success',
   'ERRO': 'danger',
   'ALERTA': 'warning',
   'INFO': 'info'
}

const usuarioSlice = createSlice({
   name: 'usuario',
   initialState: {
      aguardandoDados: false,
      logado: false,
      aguardandoVerlogin: false,
      dados: {},
      jwt: {}, // Dados de autenticação JWT
      perfis: [],
      mensagemRetorno: '',
      tipoMensagem: tiposMensagens.SUCESSO
   },
   reducers: {
      fecharMensagemAction: (state, action) => {
         state.mensagemRetorno = ''
      },
      setMensagemAction: (state, action) => {
         state.mensagemRetorno = action.payload.mensagem;
         state.tipoMensagem = action.payload.tipoMensagem;
      },
   },
   extraReducers: {
      [loginAction.pending]: state => {
         state.aguardandoDados = true;
      },
      [loginAction.fulfilled]: (state, action) => {
         state.aguardandoDados = false;
         if (typeof action.payload.data.access === 'undefined') {
            state.tipoMensagem = tiposMensagens.ERRO;
            state.mensagemRetorno = "Erro de e-mail ou senha"
            return;
         }
         state.logado = true;
         state.dados = {
            "email": action.payload.data.email,
            "is_staff": action.payload.data.is_staff,
            "is_active": action.payload.data.is_active,
            "is_superuser": action.payload.data.is_superuser,
            "id": action.payload.data.id
         };
         if(action.payload.data.is_staff) {
            state.perfis.push("admin")
         } else {
            state.perfis.push("cidadao")
         }
      },
      [loginAction.rejected]: (state, action) => {
         state.aguardandoRegistro = false;
         state.mensagemRetorno = "Erro de e-mail ou senha";
         state.tipoMensagem = tiposMensagens.ERRO;
      },
      [verLoginAction.pending]: state => {
         state.aguardandoVerlogin = true;
      },
      [logoutAction.fulfilled]: (state, action) => {
         //  if(action.payload.data.resultado==='erro') {
         //     return;
         // }
         state.dados = {};
         localStorage.removeItem("jwt")
         state.logado = false;
      },
      [logoutAction.rejected]: (state, action) => {
         localStorage.removeItem("jwt")
         // implementar remover do cookie
         state.logado = false;
         state.dados = {};
      },
      [verLoginAction.fulfilled]: (state, action) => {
         state.aguardandoVerlogin = false;
         if (typeof action.payload.data.logado !== "undefined") {
            if (action.payload.data.logado) {
               state.logado = true;
               state.dados = {
                  "email": action.payload.data.email,
                  "is_staff": action.payload.data.is_staff,
                  "is_active": action.payload.data.is_active,
                  "is_superuser": action.payload.data.is_superuser,
                  "id": action.payload.data.id
               };
               if(action.payload.data.is_staff) {
                  state.perfis.push("admin")
               } else {
                  state.perfis.push("cidadao")
               }
               return;
            }
         }
         state.logado = false;
         state.dados = {};
      },
      [verLoginAction.rejected]: (state, action) => {
         state.aguardandoVerlogin = false;
         console.info("Erro ao tentar verificar o login")
      }
   }
});

export const { fecharMensagemAction, setMensagemAction } = usuarioSlice.actions;

export default usuarioSlice.reducer;