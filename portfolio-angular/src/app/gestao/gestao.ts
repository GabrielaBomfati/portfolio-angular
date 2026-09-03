import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarExclusao } from '../confirmar-exclusao/confirmar-exclusao';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule, MatCardModule,
MatFormFieldModule,
MatInputModule,
MatSelectModule,
MatButtonModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css',
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private loginService = inject(LoginService);

  // A lista que a tela mostra, e os estados dela
  projetos: Projeto[] = [];
  carregando = true;
  erro = '';
  erroExclusao = '';

  // Quando editandoId tem um numero, o formulario esta em modo EDICAO.
  // Quando esta null, o mesmo formulario esta em modo ADICAO.
  editandoId: number | null = null;
  salvando = false;

  // O formulario vive aqui no .ts
  // ano é obrigatorio porque a coluna no banco é YEAR NOT NULL.
  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [Validators.required]),
    status: new FormControl<'rascunho' | 'publicado'>('publicado', [Validators.required]),
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.service.listarTodos().subscribe({
      next: (lista) => {
        this.projetos = lista;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os projetos.';
        this.carregando = false;
      }
    });
  }

  // Editar nao busca nada na API: o projeto ja veio na lista.
  // patchValue joga os campos dele para dentro do formulario
  editar(p: Projeto) {
    this.editandoId = p.id ?? null;
    this.form.patchValue(p);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = this.form.value as Projeto;

    // ESTA linha decide tudo: com id, e PUT; sem id, e POST
    // Um formulario dois usos.
    const requisicao = this.editandoId
      ? this.service.atualizar(this.editandoId, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.carregar();
        this.form.reset({ ano: 2026 });
        this.editandoId = null;
      },

      error: () => {
        this.salvando = false;
        this.erro = 'Nao foi possivel salvar. Tente de novo.';
      }
    });
  }

  excluir(p: Projeto) {
    if (!p.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmarExclusao, {
      width: '400px',
      data: {
        nome: p.nome
      }
    });

    dialogRef.afterClosed().subscribe(confirmou => {
      if (!confirmou) {
        return;
      }

      this.erroExclusao = '';

      this.service.excluir(p.id!).subscribe({
        next: () => {
          this.projetos = this.projetos.filter(
            x => Number(x.id) !== Number(p.id)
          );

          this.cdr.detectChanges();
        },

        error: () => {
          this.erroExclusao = 'Não foi possível excluir. Tente de novo.';
        }
      });
    });
  }sair() {
  this.loginService.sair().subscribe({
    next: () => {
      sessionStorage.removeItem('logado');
      this.router.navigate(['/login']);
    },

    error: () => {
      sessionStorage.removeItem('logado');
      this.router.navigate(['/login']);
    }
  });
}
}