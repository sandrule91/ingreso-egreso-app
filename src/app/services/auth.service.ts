import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  //Este se va a encargar de avisarnos cuando suceda algun cambio 
  initAuthListener() {
    this.auth.authState.subscribe(fuser => {

      // existe
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            console.log({firestoreUser});
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      }
      // no existe
      else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) {
  }

  crearUsuario(nombre: string, correo: string, password: string) {
    //console.log( {nombre, email, password} );
    //Como esto devuelve una promesa, vamos al register component y ponemos then
    return this.auth.createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email)
        return this.firestore.doc(`${user.uid}/usuario`) //este es el lugar a donde quiero apuntar
          .set({ ...newUser }); //la informacion que yo quiero colocar. 
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    //hacemos return para devolvernos la promesa
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null) //Si existe retorna un true y sino un false
    )
  }

}
