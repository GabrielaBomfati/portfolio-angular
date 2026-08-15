//src/app/contato.service.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
export interface NovoContato { // o que ENVIAMOS no POST
    nome: string; email: string; mensagem: string;
}
export interface RespostaContato { // o que a API DEVOLVE no 201
    sucesso: boolean; id: number; mensagem: string;
}

@Injectable({ providedIn: 'root'})
export class ContatoService {
    private http = inject(HttpClient);
    // Troque pela sua URL publica do Codespace (porta 8000), igual na Aula 17.
    private url = 'https://solid-waddle-696p4pwx799qf55r4-8000.app.github.dev/api/contato.php';
    enviar(dados: NovoContato): Observable<RespostaContato> {
        return this.http.post<RespostaContato>(this.url, dados); // 2o arg = corpo
    }
}