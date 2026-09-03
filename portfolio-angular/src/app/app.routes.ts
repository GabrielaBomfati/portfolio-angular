import { Routes } from "@angular/router";

import { Home } from "./home/home";
import { Sobre } from "./sobre/sobre";
import { Projetos } from "./projetos/projetos";
import { Catalogo } from "./catalogo/catalogo";
import { Contato } from "./contato/contato";
import { Gestao } from './gestao/gestao';
import { Login } from './login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  { path: '', component: Home },
  { path: 'sobre', component: Sobre },
  { path: 'projetos', component: Projetos },
  { path: 'catalogo', component: Catalogo },
  { path: 'contato', component: Contato },

  { path: 'login', component: Login },

  { path: 'gestao', component: Gestao, canActivate: [authGuard] },

];