import { Injectable } from '@angular/core';
import { Progresso } from './progresso.service';
import * as firebase from 'firebase';

@Injectable()
export class Bd {

    constructor(private progresso: Progresso ){}

    public publicar(publicacao: any):void{

        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
            .push({ titulo: publicacao.titulo})
            .then((resposta) => {

                let nomeImagem = resposta.key

                //consultar o nome do usuario
                firebase.database().ref(`usuario_detalhe/${btoa(publicacao.email)}`)
                    .once('value')
                    .then( (snapshot: any) =>{
                        this.progresso.nome_usuario = snapshot.val().nome_usuario
                })

                firebase.storage().ref()
                    .child(`imagens/${nomeImagem}`)
                    .put(publicacao.imagem)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                        //acompahnamento progresso Upload
                        (snapshot: any) => {
                               this.progresso.status = 'andamento'
                               this.progresso.estado = snapshot
                        },
                        //erro processo                
                        (erro) => {
                            this.progresso.status = 'erro'
                        },
                        //finalização processo
                        () => {

                            firebase.storage().ref()
                                .child(`imagens/${nomeImagem}`)
                                .getDownloadURL()
                                .then((url: string) => {
                                    this.progresso.url_imagem = url
                                    this.progresso.status = 'concluido'
                                })
                                
                        }
                    )
            })
    }

    public consultaPublicacoes (emailUsuario: string): Promise <any> {

        return new Promise((resolve, reject) => {

            //consultar publicacoes
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
                .orderByKey()
                .once('value')
                .then((snapshot: any) => {
    
                        let publicacoes: Array<any> = []
    
                        snapshot.forEach((childSnapshot: any) => {

                            let publicacao = childSnapshot.val()
                            publicacao.key = childSnapshot.key

                            publicacoes.push(publicacao)

                        })
                        
                        return publicacoes.reverse()
                                
                })
                .then((publicacoes: any) => {

                    publicacoes.forEach((publicacao) => { 

                        firebase.storage().ref()
                            .child(`imagens/${publicacao.key}`)
                            .getDownloadURL()
                            .then((url: string) => {

                                publicacao.url_imagem = url
                                
                                //consultar o nome do usuario
                                firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                    .once('value')
                                    .then( (snapshot: any) =>{
                                        publicacao.nome_usuario = snapshot.val().nome_usuario
                                    })  
                                }) 

                    })

                    resolve(publicacoes)

                })
                
            })
        }
            

}