import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email!: string;
  password!: string;

  constructor(private router: Router) {}
  login() {
    // Aquí puedes realizar la lógica de autenticación
    // Por ejemplo, puedes verificar las credenciales en una API

    // Simplemente redireccionamos a una página de inicio después del inicio de sesión exitoso
    this.router.navigate(['/dashboard']);
  }
}
