import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Bd } from '../../bd.service';

import * as firebase from 'firebase'

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css'],
  animations: [
      trigger('animacao-post', [
        state('*', style({ opacity: 0})),
        state('criado', style({
          opacity: 1
        })),
        transition('* => criado', [
          style({opacity: 0}),
          animate('1s 100ms ease-in-out') // duração, delay e a aceleração
        ])
      ])] 
      
})
export class PublicacoesComponent implements OnInit {

  public email: string
  public publicacoes: Array<any>
  public estado: string = 'criado'

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {this.email = user.email
                                                  this.atualizarTimeLine()})                                            
  }

  public atualizarTimeLine(): void{
    this.bd.consultaPublicacoes(this.email)
      .then((publicacoes: any) => this.publicacoes = publicacoes)
  }
  
}
