import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Projeto {
    id: number;
    nome: string;
    descricao: string;
    tecnologias: string;
    link_github: string;
    ano: number;
    status: 'rascunho' | 'publicado';
}

@Injectable({ providedIn: 'root'})
export class ProjetoService {
    private http = inject(HttpClient);
    private url = 'https://solid-waddle-696p4pwx799qf55r4-3000.app.github.dev/api/projetos';

    private cabecalhoAutenticacao() {
  const token = sessionStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token ?? ''}`
    }
  };
}
    // GET público
    listar(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(this.url);
    }

    // GET da gestão - precisa da sessão
   listarTodos(): Observable<Projeto[]> {
  return this.http.get<Projeto[]>(
    `${this.url}/todos`,
    this.cabecalhoAutenticacao()
  );
}

    // POST - precisa da sessão
    criar(projeto: Projeto): Observable<{id?: number; mensagem?: string}> {
  return this.http.post<{id?: number; mensagem?: string}>(
    this.url,
    projeto,
    this.cabecalhoAutenticacao()
  );
}

    // PUT - precisa da sessão
    atualizar(id: number, projeto: Projeto): Observable<{id?: number; mensagem?: string}> {
  return this.http.put<{id?: number; mensagem?: string}>(
    `${this.url}/${id}`,
    projeto,
    this.cabecalhoAutenticacao()
  );
}

   excluir(id: number): Observable<void> {
  return this.http.delete<void>(
    `${this.url}/${id}`,
    this.cabecalhoAutenticacao()
  );
}
}