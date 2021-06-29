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
  languages = ['typescript', 'python', 'C'];
  themes = ['twilight', 'dracula', 'xcode', 'eclipse'];
  selectedLang = 'typescript';
  selectedTheme = 'twilight';
  spinner = false;
  extensionType: string;
  fileName: string;
  fileContent: any;
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
      this.userService.getUserByEmail(this.authService.decodedToken.email).subscribe(user => this.userService.currentUser = user);
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
    this.spinner = true;
    if (this.extensionType && this.fileContent && this.fileName) {
      const data: KafkaModel = {
        runId: null,
        userId: this.userService.currentUser.id,
        fileName: this.fileName,
        fileContent: btoa(this.fileContent),
        code: btoa(this.editor.value),
        extensionEnd: this.extensionType,
        language: this.selectedLang
      };

      const checkCode = {
        userId: this.userService.currentUser.id,
        codeEncoded: btoa(this.editor.value)
      };
      // test if user code is not a copied
      this.codeEditorService.testUserCode(checkCode).subscribe(codeResult => console.log(codeResult));

      // this.codeEditorService.postIntoKafkaTopic(data).subscribe(jsonData => {
      //   // TODO Get stdout + dl converted file
      // });
      // this.downloadFile();
      this.spinner = false;
    }
    else {
      alert('Les champs ne peuvent pas être vides');
      this.spinner = false;
    }
  }

  updateLang(): void {
    if (this.selectedLang === 'C' ) {
      this.editor.mode = 'c_cpp';
    } else {
      this.editor.mode = this.selectedLang;
    }
  }

  updateTheme(): void {
    this.editor.setTheme(this.selectedTheme);
  }

  downloadFile(): void {
    const file: any = {
      name: 'julien',
      age: 23
    };
    const newFileName = this.fileName.split('.').slice(0, -1).join('.');
    const newFile = new File([JSON.stringify(file)], newFileName + '.' + this.extensionType, {type: 'text/' +
        this.extensionType + ';charset=utf-8'});
    fileSaver.saveAs(newFile);
  }

  getUploadFile(e): void {
    this.fileName = e.target.files[0].name;
    const fileReader = new FileReader();
    fileReader.onloadend = (() => {
      this.fileContent = fileReader.result;
    });
    fileReader.readAsText(e.target.files[0]);
  }
}
