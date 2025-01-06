import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { response } from 'express';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  hide = true;

  private userSubscription: Subscription | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.ngZone.run(() => {
          this.router.navigate(['/']);
       });
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Mostrar alerta de cargando
      Swal.fire({
        title: 'Cargando...',
        text: 'Por favor, espere.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.authService.login(email, password).then(response => {
        // Cerrar alerta de cargando
        Swal.close();

        // Redirigir al usuario al sistema
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
      }).catch(error => {
        // Cerrar alerta de cargando
        Swal.close();

        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales inválidas. Por favor, inténtelo de nuevo.'
        });
      });
    }
  }

  logout() {
    this.authService.logout();
  }

}
