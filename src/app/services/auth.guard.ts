import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /*Un guard es para proteger las rutas, es decir, 
  para que no entre cualquiera si no esta logeado..
  RECORDAR: meterlo en app.routing.module */

  constructor(private authService: AuthService,
    private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuth()
      .pipe(
        tap(estado => {
          if ( !estado ) { this.router.navigate(['/login'])}
        } )
      );
  }
}
