import { Component, inject, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-login',
  imports: [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private loginService = inject(LoginService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuario = '';
  senha = '';
  erro = '';
  entrando = false;

  entrar() {

    this.erro = '';
    this.entrando = true;

    this.loginService.entrar(this.usuario, this.senha).subscribe({

      next: () => {
  sessionStorage.setItem('logado', 'true');
  window.dispatchEvent(new Event('login'));
  this.entrando = false;
  this.router.navigate(['/gestao']);
},

      error: (erro) => {
  console.log('Erro do login:', erro);

  this.entrando = false;
  this.erro = erro.error?.erro || 'Usuário ou senha incorretos.';

  this.cdr.detectChanges();
}
    });
  }
}