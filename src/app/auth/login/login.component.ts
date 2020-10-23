import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui  from '../../shared/ui.actions';



// ES6 Modules or TypeScript
import Swal from 'sweetalert2';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

//la clase ondestroy es para terminar con el ciclo de vida
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit() {
    //Creamos el formulario
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    //Creamos otra suscripcion y lo metemos dentro de la variable 
    this.uiSubscription = this.store.select('ui')
    .subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy() {
    //Limpiamos las suscripciones para que no se produzcan duplicados
    this.uiSubscription.unsubscribe();

  }

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch( ui.isLoading() ); 

    // Es una ventana emergente
    // Swal.fire({
    //   title: 'Espere por favor',
    //   willOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario(correo, password)
      .then(credenciales => {
        console.log(credenciales);
      // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }



}


