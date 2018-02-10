import { Component, OnInit, Input } from '@angular/core';
import {ApiWordModel} from './../../../models/ApiWord';
import { DictionaryProviderService} from './../../../providers/dictionary.provider.service';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.css']
})
export class WordCardComponent implements OnInit {

  @Input('word') word: ApiWordModel;
  @Input('searchComp')searchComp = false;
  private matMenuHiden = false;
  constructor(private dictProvider: DictionaryProviderService) { }

  AddToDictionary(dictionaryName: string) {
    this.dictProvider.AddWord(this.word, dictionaryName);
  }
  ngOnInit() {
  }

}
