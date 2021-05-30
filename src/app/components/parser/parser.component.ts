import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements AfterViewInit {
  @ViewChild('editor') editor;
  languages = ['typescript', 'python'];
  themes = ['twilight', 'dracula', 'xcode', 'eclipse'];
  selectedLang = 'typescript';
  selectedTheme = 'twilight';
  isExec = false;
  extensionType: string;
  exampleCode = `
function testThis() {
  console.log("it's working!")
}`;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 4,
      enableBasicAutocompletion: true
    });
    this.editor.setTheme(this.selectedTheme);
    this.editor.mode = this.selectedLang;
    this.editor.value = this.exampleCode;
  }

  getUserParserCode(): void {
    if (this.extensionType) {
      this.isExec = true;
      this.downloadFile();
      this.isExec = false;
    }
    else {
      alert('l\'extention est vide');
    }
  }

  updateLang(): void {
    this.editor.mode = this.selectedLang;
  }

  updateTheme(): void {
    this.editor.setTheme(this.selectedTheme);
  }

  downloadFile(): void {
    const file: any = {
      name: 'julien',
      age: 23
    };
    const newFile = new File([JSON.stringify(file)],  'example.' + this.extensionType, {type: 'text/json;charset=utf-8'});
    fileSaver.saveAs(newFile);
  }
}
