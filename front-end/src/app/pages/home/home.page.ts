import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
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
    const userData = {
      email: this.email,
      contraseña: this.password
    };
    // Simplemente redireccionamos a una página de inicio después del inicio de sesión exitoso
    axios.post('https://backend-iotic.vercel.app/login', userData)
      .then(response => {
        // Manejar la respuesta exitosa aquí
        console.log(response.data);
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        // Manejar el error aquí
        console.error(error);
        alert('Credenciales incorrecta intente de nuevo');
      });
   // this.router.navigate(['/dashboard']);
  }
}
