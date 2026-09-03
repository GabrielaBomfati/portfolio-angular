import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RespostaLogin {
  mensagem?: string;
  erro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  private apiUrl = 'https://solid-waddle-696p4pwx799qf55r4-8000.app.github.dev/api/login.php';

  entrar(usuario: string, senha: string): Observable<RespostaLogin> {
  return this.http.post<RespostaLogin>(
    this.apiUrl,
    {
      usuario,
      senha
    },
    {
      withCredentials: true
    }
  );
  }
  sair(): Observable<{ mensagem?: string }> {
  return this.http.post<{ mensagem?: string }>(
    'https://solid-waddle-696p4pwx799qf55r4-8000.app.github.dev/api/logout.php',
    {},
    {
      withCredentials: true
    }
  );
}
}