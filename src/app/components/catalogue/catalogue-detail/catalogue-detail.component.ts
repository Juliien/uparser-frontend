import { Component, OnInit } from '@angular/core';
import {CatalogService} from '../../../services/catalog.service';
import {CodeModel} from '../../../models/code.model';
import {KafkaModel} from '../../../models/kafka.model';
import {CodeEditorService} from '../../../services/code-editor.service';
import {RunnerOutputModel} from '../../../models/runner-output.model';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-catalogue-detail',
  templateUrl: './catalogue-detail.component.html',
  styleUrls: ['./catalogue-detail.component.css']
})
export class CatalogueDetailComponent implements OnInit {
  parser: CodeModel;
  fileName: string;
  fileContent: any;
  spinner = false;
  runner: RunnerOutputModel;

  constructor(private catalogService: CatalogService,
              private codeEditorService: CodeEditorService) { }

  ngOnInit(): void {
    this.catalogService.getCatalogById(document.location.href.substring(document.location.href.lastIndexOf('/') + 1))
      .subscribe(data => this.parser = data);
  }

  getUploadFile(e): void {
    this.fileName = e.target.files[0].name;
    const fileReader = new FileReader();
    fileReader.onloadend = (() => {
      this.fileContent = fileReader.result;
    });
    fileReader.readAsText(e.target.files[0]);
  }

  convertFile(): void {
    this.spinner = true;
    if (this.fileContent && this.fileName) {
      const data: KafkaModel = {
        id: '1',
        inputfile: btoa(this.fileContent),
        algorithm: this.parser.codeEncoded,
        from: this.parser.extensionStart,
        to: this.parser.extensionEnd,
        language: this.parser.language
      };

      this.codeEditorService.postIntoKafkaTopic(data, '1').subscribe(json => {
        this.runner = json;
        this.spinner = false;
        this.downloadFile();
      });
    }
  }

  downloadFile(): void {
    const newFileName = this.fileName.split('.').slice(0, -1).join('.');
    const newFile = new File([this.runner.artifact], newFileName + '.' + this.parser.extensionEnd,
      {type: 'text/' + this.parser.extensionEnd + ';charset=utf-8'});
    fileSaver.saveAs(newFile);
  }
}
