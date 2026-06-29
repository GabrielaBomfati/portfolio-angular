import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Tecnologia {
    id: number;
    nome: string;
    categoria: string;
    descricao: string;
    ano_criacao: number;
}

@Injectable({ providedIn: 'root'})
export class TecnologiaService {
    private http = inject(HttpClient);
    private url = 'https://solid-waddle-696p4pwx799qf55r4-8000.app.github.dev/api/tecnologias.php';

    listar(): Observable<Tecnologia[]> {
        return this.http.get<Tecnologia[]>(this.url);
    }
}
