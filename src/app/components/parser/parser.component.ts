import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as fileSaver from 'file-saver';
import {CodeEditorService} from '../../services/code-editor.service';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';
import {KafkaModel} from '../../models/kafka.model';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements AfterViewInit, OnInit {
  @ViewChild('editor') editor;
  languages = ['typescript', 'python'];
  themes = ['twilight', 'dracula', 'xcode', 'eclipse'];
  selectedLang = 'typescript';
  selectedTheme = 'twilight';
  isExec = false;
  extensionType: string;
  file: any;
  exampleCode = `
function testThis() {
  console.log("it's working!")
}`;

  constructor(private codeEditorService: CodeEditorService,
              private userService: UserService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    if (!this.userService.currentUser) {
      this.userService.getUserByEmail({email: this.authService.decodedToken.sub}).subscribe(user => this.userService.currentUser = user);
    }
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

  convertFile(): void {
    // const formData = new FormData();
    // formData.append('file', this.file.data);
    // console.log(formData);
    if (this.extensionType) {
      const data: KafkaModel = {
        runId: '111',
        userId: this.userService.currentUser.id,
        fileName: 'a file',
        fileContent: 'the file to parse',
        code: this.editor.value,
        extensionEnd: this.extensionType,
        language: this.selectedLang
      };

      this.isExec = true;
      this.codeEditorService.postIntoKafkaTopic(data).subscribe(jsonData => {
        console.log(jsonData);
        this.downloadFile();
      });
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
