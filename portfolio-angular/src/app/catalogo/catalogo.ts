import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TecnologiaService, Tecnologia } from '../tecnologia.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  imports: [MatCardModule, AsyncPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {

  private service = inject(TecnologiaService);

  tecnologias$!: Observable<Tecnologia[]>;

  ngOnInit() {
    this.tecnologias$ = this.service.listar();
  }
}