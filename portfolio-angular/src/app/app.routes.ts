import { Routes } from "@angular/router";
import { Home } from "./home/home";
import { Sobre } from "./sobre/sobre";
import { Projetos } from "./projetos/projetos";
import { Catalogo } from "./catalogo/catalogo";
import { Contato } from "./contato/contato";

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'sobre', component: Sobre },
    { path: 'projetos', component: Projetos },
    { path: 'catalogo', component: Catalogo},
    { path: 'contato', component: Contato},
];
