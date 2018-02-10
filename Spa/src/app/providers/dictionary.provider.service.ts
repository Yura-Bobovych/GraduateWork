import { Injectable } from '@angular/core';
import { HttpHelper} from './../services/http-helper.service';
import { CONFIG } from './../app.config';
import { ApiWordModel} from './../models/ApiWord';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DictioanyPageComponent } from '../components/page-components/dictioany-page/dictioany-page.component';

@Injectable()
export class DictionaryProviderService {
  DictionaryList: Array<string>;

  DictionaryContainer: Array<Array<ApiWordModel>>;

  constructor(private httpHelper: HttpHelper) {
    if (this.DictionaryContainer == null) {
      this.DictionaryContainer = new Array<Array<ApiWordModel>>();
    }
    this.GetDictioanryList();
    if (!this.DictionaryList) {
      this.DictionaryList = [];
      this.GetDictioanryList();
    }
  }

  GetDictioanryList() {
    this.httpHelper.GetAuthorize(CONFIG.Services.WordsApi.BaseUrl + CONFIG.Services.WordsApi.GetDictionariesList).subscribe(res => {
      this.DictionaryList = JSON.parse(res.text());
      for (const item of JSON.parse(res.text())) {
        this.DictionaryContainer[item] = null;
      }
    });
  }
  GetDictionatryData(dictName: string): Observable<Array<ApiWordModel>> {
    return this.httpHelper.
    GetAuthorize(CONFIG.Services.WordsApi.BaseUrl + CONFIG.Services.WordsApi.GetDictionaryData, {'dictionaryName': dictName})
    .map(res => {
      const dict = JSON.parse(res.text());
      console.log(dict);
      const WordList = new Array<ApiWordModel>();

      for (const word of dict['words'])
      {
        const wordObj = new ApiWordModel();
        wordObj.Definition = word['definition'];
        wordObj.Example = word['example'];
        wordObj.Word = word['word'];
        WordList.push(wordObj);
      }
      this.DictionaryContainer[dictName] = WordList;
      console.log(WordList);
      return WordList;
    });
  }
  AddWord(word: ApiWordModel, dictionaryName: string) {
    this.httpHelper.PostAuthorize(CONFIG.Services.WordsApi.BaseUrl + CONFIG.Services.WordsApi.AddWord,
       {'word': word, 'dictionaryName': dictionaryName}).subscribe(res => {

    });
  }
  CreateDictionary(dictName: string) {
    this.httpHelper.PostAuthorize(CONFIG.Services.WordsApi.BaseUrl + CONFIG.Services.WordsApi.CreateDict, {'dictionaryName': dictName})
    .subscribe(res => {
      this.DictionaryList.push(dictName);
    });
    }
}
