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
    private url = 'https://solid-waddle-696p4pwx799qf55r4-8000.app.github.dev/api/projetos.php';

    // GET público
    listar(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(this.url);
    }

    // GET da gestão - precisa da sessão
    listarTodos(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(`${this.url}?todos=1`, {
            withCredentials: true
        });
    }

    // POST - precisa da sessão
    criar(projeto: Projeto): Observable<{id?: number; mensagem?: string}> {
        return this.http.post<{id?: number; mensagem?: string}>(
            this.url,
            projeto,
            { withCredentials: true }
        );
    }

    // PUT - precisa da sessão
    atualizar(id: number, projeto: Projeto): Observable<{id?: number; mensagem?: string}> {
        return this.http.put<{id?: number; mensagem?: string}>(
            `${this.url}?id=${id}`,
            projeto,
            { withCredentials: true }
        );
    }

    // DELETE - precisa da sessão
    excluir(id: number): Observable<{mensagem?: string}> {
        return this.http.delete<{mensagem?: string}>(
            `${this.url}?id=${id}`,
            { withCredentials: true }
        );
    }
}