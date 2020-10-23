


export class Usuario {

    static fromFirebase( { correo, nombre, uid } ){
        return new Usuario( uid, nombre, correo );
    }

    constructor(
        public uid: string,
        public nombre: string,
        public correo: string
    ){}
}
