import { Component, OnInit, ViewChild } from '@angular/core';
import { Autenticacao } from "../autenticacao.service";

import { IncluirPublicacaoComponent } from './incluir-publicacao/incluir-publicacao.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('publicacoes') public publicacoes: any

  constructor(private autenticacao: Autenticacao, private modalService: NgbModal) {}

  ngOnInit() {
  }

  public sair():void{
   this.autenticacao.sair()
  }

  public atualizarTimeLine(publicacao: any): void{
      this.publicacoes.publicacoes.unshift(publicacao)
  }
  
  open() {
    const modalRef = this.modalService.open(IncluirPublicacaoComponent)
      .result.then((result) => this.atualizarTimeLine(result))
  }

}
