import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjetoService, Projeto } from '../projeto.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-projetos',
  imports: [MatCardModule, MatButtonModule, AsyncPipe],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos {

  private service = inject(ProjetoService);

  projetos$!: Observable<Projeto[]>;

  ngOnInit() {
    this.projetos$ = this.service.listar();
  }
}