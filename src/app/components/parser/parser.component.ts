import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as fileSaver from 'file-saver';
import {CodeEditorService} from '../../services/code-editor.service';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';
import {KafkaModel} from '../../models/kafka.model';
import {CodeModel} from '../../models/code.model';
import {RunnerOutputModel} from '../../models/runner-output.model';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements AfterViewInit, OnInit {
  @ViewChild('editor') editor;
  languages = ['python', 'typescript', 'C'];
  themes = ['twilight', 'dracula', 'xcode', 'eclipse'];
  selectedLang = 'python';
  selectedTheme = 'twilight';
  selectedCode: CodeModel;
  codeHistory: CodeModel[];
  runnerOutput: RunnerOutputModel;
  extensionType: string;
  errorMessage: string;
  fileName: string;
  fileContent: any;
  spinner = false;
  exampleCode = `import sys

with open(argv[1]) as file:
  print(file.read())
 `;

  constructor(private codeEditorService: CodeEditorService,
              private userService: UserService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    if (!this.userService.currentUser) {
      this.userService.getUserByEmail(this.authService.decodedToken.email).subscribe(user => {
        this.userService.currentUser = user;
        this.getUserCodeHistory();
      });
    } else {
      this.getUserCodeHistory();
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
    this.runnerOutput = null;

    if (this.extensionType && this.fileContent && this.fileName) {
      const fileExtension = this.fileName.split('.').pop();
      const data: KafkaModel = {
        id: '1',
        inputfile: btoa(this.fileContent),
        algorithm: btoa(this.editor.value),
        from: fileExtension,
        to: this.extensionType,
        language: this.selectedLang
      };

      const checkCode = {
        userId: this.userService.currentUser.id,
        extensionStart: fileExtension,
        extensionEnd: this.extensionType,
        language: this.selectedLang,
        codeEncoded: btoa(this.editor.value),
        date: null
      };

      // test if user code is not a copied
      this.codeEditorService.testUserCode(checkCode).subscribe(codeResult => console.log(codeResult));

      this.codeEditorService.postIntoKafkaTopic(data).subscribe(jsonData => {
        this.runnerOutput = jsonData;
        this.spinner = false;
        // this.downloadFile();
      }, (error) => {
        if (error.status === 500) {
          this.errorMessage = 'Timeout !';
          this.spinner = false;
        }
      });
    }
    else {
      this.errorMessage = 'Les champs ne peuvent pas être vides'
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

  updateCode(): void {
    if (this.selectedCode != null) {
      this.editor.value = atob(this.selectedCode.codeEncoded);
    }
  }

  updateTheme(): void {
    this.editor.setTheme(this.selectedTheme);
  }

  downloadFile(): void {
    const newFileName = this.fileName.split('.').slice(0, -1).join('.');
    const newFile = new File([this.runnerOutput.stdout], newFileName + '.' + this.extensionType, {type: 'text/' +
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

  getUserCodeHistory(): void {
    this.codeEditorService.getUserCodeHistory().subscribe(history => this.codeHistory = history);
  }
}
