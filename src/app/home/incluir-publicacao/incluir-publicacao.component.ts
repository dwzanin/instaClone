import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Progresso } from '../../progresso.service';
import { Bd } from '../../bd.service'; 

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import * as firebase from 'firebase';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public email: string
  private imagem: any

  public ulrImg: string = 'Choose a image'

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  public closeResult: string;

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null, Validators.required)
  })

  constructor(private bd: Bd, private progresso: Progresso, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => this.email = user.email)
  }

  public publicar(): void{

    if (this.formulario.invalid){
      this.formulario.get('titulo').markAsTouched()
      return
    }

    this.bd.publicar( {email: this.email,
                      titulo: this.formulario.value.titulo,
                      imagem: this.imagem[0]} );

    let acompanhamentoUpload = Observable.interval(800)

    let continua = new Subject()

    continua.next(true)

    acompanhamentoUpload
      .takeUntil(continua)
      .subscribe( () => {this.progressoPublicacao = 'andamento'

                         this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)

                         if (this.progresso.status === 'concluido'){

                             //emitir um evento do component parent (home)
                             continua.next(false)

                             this.activeModal.close({
                               nome_usuario: this.progresso.nome_usuario,
                               url_imagem: this.progresso.url_imagem,
                               titulo: this.formulario.value.titulo,
                             })
                             this.progressoPublicacao = 'pendente'
                             
                         }

                        })

  }

  public preparaImagemUpload(evento: Event): void{

    if ((<HTMLInputElement>evento.target).files.length > 0){
      this.imagem = (<HTMLInputElement>evento.target).files
      this.ulrImg = this.imagem.item(0).name
    }
  }

}