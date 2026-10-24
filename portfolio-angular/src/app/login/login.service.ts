import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RespostaLogin {
  token: string;
  mensagem?: string;
  erro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  private apiUrl = 'https://solid-waddle-696p4pwx799qf55r4-3000.app.github.dev/api/login';

  entrar(email: string, senha: string): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>(
      this.apiUrl,
      { email, senha }
    );
  }

  sair(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('logado');
  }
}