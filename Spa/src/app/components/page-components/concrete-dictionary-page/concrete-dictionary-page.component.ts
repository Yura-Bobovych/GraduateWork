import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DictionaryProviderService} from './../../../providers/dictionary.provider.service';
import {ApiWordModel} from './../../../models/ApiWord';

@Component({
  selector: 'app-concrete-dictionary-page',
  templateUrl: './concrete-dictionary-page.component.html',
  styleUrls: ['./concrete-dictionary-page.component.css']
})
export class ConcreteDictionaryPageComponent implements OnInit {

  dictionaryName: string;
  dictionatyData: Array<ApiWordModel>;
  constructor(private route: ActivatedRoute,
              private dictPorovider: DictionaryProviderService) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.dictionaryName = res['id'];
      this.getDictionaryData();
    });
  }
  getDictionaryData() {
    console.log(this.dictPorovider.DictionaryList.includes(this.dictionaryName));
    if (this.dictPorovider.DictionaryList.includes(this.dictionaryName)) {
      this.dictPorovider.GetDictionaryData(this.dictionaryName).subscribe(res => {
        this.dictionatyData = res;
      });
    }
  }
}
