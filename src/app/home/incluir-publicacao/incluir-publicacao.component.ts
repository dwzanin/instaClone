import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Progresso } from '../../progresso.service';
import { Bd } from '../../bd.service'; 

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import * as firebase from 'firebase';


@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public email: string
  private imagem: any

  @Output()
  public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>()

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  constructor(private bd: Bd, private progresso: Progresso) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => this.email = user.email)
  }

  public publicar(): void{
    this.bd.publicar( {email: this.email,
                      titulo: this.formulario.value.titulo,
                      imagem: this.imagem[0]} );

    let acompanhamentoUpload = Observable.interval(1500)

    let continua = new Subject()

    continua.next(true)

    acompanhamentoUpload
      .takeUntil(continua)
      .subscribe( () => {this.progressoPublicacao = 'andamento'

                         this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)

                         if (this.progresso.status === 'concluido'){
                             this.progressoPublicacao = 'concluido'
                             //emitir um evento do component parent (home)
                             this.atualizarTimeLine.emit()
                             continua.next(false)
                         }

                        })

  }

  public preparaImagemUpload(evento: Event): void{
    this.imagem = (<HTMLInputElement>evento.target).files;
  }

}
