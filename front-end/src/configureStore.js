import { configureStore } from '@reduxjs/toolkit';
//import localizacaoSlice from './app/modules/localizacao/localizacao.slice.js';
import usuarioSlice from './app/modules/usuario/usuario.slice';
//import cidadaoSlice from './app/modules/cidadao/cidadao.slice';
import logger from './logger.js';

const store = configureStore({
   reducer: {
      usuario: usuarioSlice,
   },
   middleware:  (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger)
});

export default store;