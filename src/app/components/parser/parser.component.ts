import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements AfterViewInit {
  @ViewChild('editor') editor;
  languages = ['typescript', 'python'];
  themes = ['xcode', 'eclipse', 'twilight', 'dracula'];
  selectedLang = 'typescript';
  selectedTheme = 'xcode';
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
   alert(this.editor.value);
  }

  updateLang(): void {
    this.editor.mode = this.selectedLang;
  }

  updateTheme(): void {
    this.editor.setTheme(this.selectedTheme);
  }
}
