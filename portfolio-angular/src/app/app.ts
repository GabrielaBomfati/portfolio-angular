import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';

import { MatSidenavModule } from '@angular/material/sidenav';

import { LoginService } from './login/login.service';

@Component({

  selector: 'app-root',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'

})

export class App implements OnInit {

  private router = inject(Router);
  private loginService = inject(LoginService);

  logado = false;

  ngOnInit() {
  this.verificarLogin();

  window.addEventListener('login', () => {
    this.verificarLogin();
  });
}
  verificarLogin() {
    this.logado = sessionStorage.getItem('logado') === 'true';
  }

  sair() {
  this.loginService.sair();

  this.logado = false;
  this.router.navigate(['/login']);
}
}

  
