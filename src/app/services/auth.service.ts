import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Este se va a encargar de avisarnos cuando suceda algun cambio 
  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      console.log( fuser);
      console.log( fuser?.uid);
      console.log( fuser?.email);
    });
  }

  constructor( public auth: AngularFireAuth,
    private firestore: AngularFirestore) {
  }

  crearUsuario( nombre: string, email: string, password: string){
  //console.log( {nombre, email, password} );
  //Como esto devuelve una promesa, vamos al register component y ponemos then
  return this.auth.createUserWithEmailAndPassword( email, password )
    .then ( ({user}) => {
      const newUser = new Usuario( user.uid, nombre, user.email)
      return this.firestore.doc(`${ user.uid }/usuario`) //este es el lugar a donde quiero apuntar
        .set({...newUser}); //la informacion que yo quiero colocar. 
    });
  }

  loginUsuario( email: string, password: string){
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout(){
    //hacemos return para devolvernos la promesa
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null) //Si existe retorna un true y sino un false
    )
  }

}
