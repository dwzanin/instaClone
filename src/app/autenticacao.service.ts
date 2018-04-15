import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Usuario } from "./acesso/usuario.model";
import * as firebase from 'firebase';

@Injectable()
export class Autenticacao {

    public token_id: string

    constructor(private router: Router){}

    public cadastrarUsuario(usuario: Usuario): Promise<any>{

        //console.log ('chegamos ao service: ', usuario)
        return firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
                
                //remover a senha do atributo senha do objeto usuario
                delete usuario.senha

                //registrando dados complementares do usuairo no path email na base64
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set(usuario)

            })
            .catch((error: Error) => {
                console.log(error)
            })
    }

    public autenticar (email: string, senha: string): void{

        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => {
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken)
                        this.router.navigate(['/home'])})
            })
            .catch((error: Error) => {console.log(error)})

    }

    public autenticado(): boolean{

        if (this.token_id === undefined && localStorage.getItem('idToken') != null){
            this.token_id = localStorage.getItem('idToken')
        }

        if (this.token_id === undefined)
        this.router.navigate(['/'])

        return this.token_id !== undefined
    }
    
    public sair():void{
        firebase.auth().signOut()
            .then(() => {localStorage.removeItem('idToken')
                         this.token_id = undefined
                         this.router.navigate(['/'])})
    }
}