// src/app/contato.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContatoService } from '../contato.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule,
MatFormFieldModule,
MatInputModule,
MatButtonModule], // libera formGroup/formControlName no HTML
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {
  private fb = inject(FormBuilder);
  private service = inject(ContatoService);
  enviando = false; sucesso = ''; erro = ''; // estados da tela

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['',[Validators.required, Validators.minLength(10)]],
  });

  private focarPrimeiroCampoInvalido() {
    const campos = ['nome', 'email', 'mensagem'];
    for (const campo of campos) {
        const controle = this.form.get(campo);
        if (controle?.invalid) {
            const elemento = document.getElementById(campo);
            if (elemento) {
                elemento.focus();
            }
            break;
        }
    }
}

  onSubmit() {
    this.sucesso = ''; this.erro = '';
    if (this.form.invalid) { // trava: nem chama a API se invalido
        this.form.markAllAsTouched(); // força a exibir os erros de campo
        this.focarPrimeiroCampoInvalido();
        return;
    }
    this.enviando = true; // desabilita o botão enquanto envia
    this.service.enviar(this.form.getRawValue()).subscribe({
      next: (resp) => {
        this.sucesso = resp.mensagem;
        this.form.reset();
        this.enviando = false;
      },
      error: (err: HttpErrorResponse) => {
    if (err.status === 400 && Array.isArray(err.error?.erros)) {
        this.erro = err.error.erros.join(' ');
    } else {
        this.erro = 'Não foi possível enviar. Tente novamente.';
    }
    this.enviando = false;
    },
    });
  }
}
