import { Injectable } from '@angular/core';
import { HttpHelper} from './../services/http-helper.service';
import { CONFIG } from './../app.config';
import { ApiWordModel} from './../models/ApiWord';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DictioanyPageComponent } from '../components/page-components/dictioany-page/dictioany-page.component';

@Injectable()
export class DictionaryProviderService {
  _dictionaryList: Array<string>;
  _dictionaryContainer: Array<Array<ApiWordModel>>;
  qwe = 0;
  tryGetList = false;
  tryGetContainer = false;
  DictionaryContainer;

   get DictionaryList(): Array<string> {
    console.log('get DictionaryList' + this.qwe++ + this.tryGetList);
    if (this._dictionaryList) {
      return this._dictionaryList;
    } else {
      if (!this.tryGetList) {
        this.tryGetList = true;
        this.GetDictioanryList().subscribe();
        console.log('get dict list from api');
      }
    }
    return [];
  }
  set DictionaryList(value: Array<string> ) {
    this._dictionaryList = value;
  }

  constructor(private httpHelper: HttpHelper) {
    if (this._dictionaryContainer == null) {
      this._dictionaryContainer = new Array<Array<ApiWordModel>>();
    }

    this.DictionaryContainer = new Proxy(this._dictionaryContainer, {
      get: function(target, name) {
        if (target) {
          if (target[name]) {
            return target[name];
          }
        } else {
          if (!this.tryGetContainer) {
            this.tryGetContainer = true;
           this.GetDictionaryData(name);
          }
        }
        return [];
      },
      set: function(target, prop, value) {
        target[prop] = value;
        return true;
      }
    });
  }

  GetDictioanryList() {
    return this.httpHelper.GetAuthorize(CONFIG.Services.WordsApi.BaseUrl + CONFIG.Services.WordsApi.GetDictionariesList).map(res => {
      this.DictionaryList = JSON.parse(res.text());
      for (const item of JSON.parse(res.text())) {
        this.DictionaryContainer[item] = null;
      }
      return  JSON.parse(res.text());
    });
  }
  GetDictionaryData(dictName: string): Observable<Array<ApiWordModel>> {
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
