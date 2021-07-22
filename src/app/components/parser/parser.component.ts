import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as fileSaver from 'file-saver';
import {CodeEditorService} from '../../services/code-editor.service';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';
import {KafkaModel} from '../../models/kafka.model';
import {CodeModel} from '../../models/code.model';
import {RunnerOutputModel} from '../../models/runner-output.model';
import {FileModel} from '../../models/file.model';
import {FileService} from '../../services/file.service';

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
  selectedFile: FileModel;
  viewCurrentFile: FileModel;
  testFiles: FileModel[];
  extensionType: string;
  errorMessage: string;
  spinner = false;
  exampleCode = `import sys

with open(argv[1]) as file:
  print(file.read())
 `;

  constructor(private codeEditorService: CodeEditorService,
              private userService: UserService,
              private authService: AuthenticationService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    if (!this.userService.currentUser) {
      this.userService.getUserByEmail(this.authService.decodedToken.email).subscribe(user => {
        this.userService.currentUser = user;
        this.init();
      });
    } else {
      this.init();
    }
  }

  ngAfterViewInit(): void {
    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 4
    });
    this.editor.setTheme(this.selectedTheme);
    this.editor.mode = this.selectedLang;
    this.editor.value = this.exampleCode;
  }

  init(): void {
    this.codeEditorService.getUserCodeHistory().subscribe((history) => this.codeHistory = history);
    this.fileService.getFilesByUserId(this.userService.currentUser.id).subscribe(files => {
      files.forEach(file => file.fileContent = atob(file.fileContent));
      this.testFiles = files;
    });
  }

  convertFile(): void {
    this.spinner = true;
    this.runnerOutput = null;

    if (this.selectedFile) {
      if (this.extensionType) {
        const data: KafkaModel = {
          id: '1',
          inputfile: btoa(this.selectedFile.fileContent),
          algorithm: btoa(this.editor.value),
          from: this.selectedFile.fileExtension,
          to: this.extensionType,
          language: this.selectedLang
        };

        const checkCode = {
          userId: this.userService.currentUser.id,
          extensionStart: this.selectedFile.fileExtension,
          extensionEnd: this.extensionType,
          language: this.selectedLang,
          codeEncoded: btoa(this.editor.value),
          date: null
        };

        // test if user code is not a copied
        this.codeEditorService.testUserCode(checkCode).subscribe(codeResult => console.log(codeResult));
        this.postToKafka(data);
      } else {
        this.errorMessage = 'Les champs ne peuvent pas être vides';
        this.spinner = false;
      }
    } else {
      const data: KafkaModel = {
        id: '1',
        inputfile: '',
        algorithm: btoa(this.editor.value),
        from: '',
        to: '',
        language: this.selectedLang
      };
      this.postToKafka(data);
    }
  }

  postToKafka(model: KafkaModel): void {
    this.codeEditorService.postIntoKafkaTopic(model, this.userService.currentUser.id).subscribe(jsonData => {
      this.runnerOutput = jsonData;
      this.spinner = false;
    }, (error) => {
      if (error.status === 500) {
        this.errorMessage = 'Timeout !';
        this.spinner = false;
      }
    });
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

  updateFile(file: FileModel): void {
    this.selectedFile = file;
  }

  downloadFile(): void {
    const fileContent = this.runnerOutput.artifact;
    const newFileName = this.selectedFile.fileName.split('.').slice(0, -1).join('.');
    const newFile = new File([fileContent], newFileName + '.' + this.extensionType,
      {type: 'text/' + this.extensionType + ';charset=utf-8'});
    fileSaver.saveAs(newFile);
  }

  getUploadFile(e): void {
    const fileReader = new FileReader();
    fileReader.onloadend = (() => {
      const fileContent: any = fileReader.result;

      const file = {
        userId: this.userService.currentUser.id,
        fileName: e.target.files[0].name,
        fileContent: btoa(fileContent),
        fileExtension: e.target.files[0].name.split('.').pop()
      };

      this.fileService.saveFile(file).subscribe(() => {
        this.fileService.getFilesByUserId(this.userService.currentUser.id).subscribe(files => {
          this.testFiles = [];
          files.forEach(f => f.fileContent = atob(f.fileContent));
          this.testFiles = files;
        });
      });
    });
    fileReader.readAsText(e.target.files[0]);
  }

  deleteFile(id: string): void {
    this.fileService.delete(id).subscribe(() => {
      this.fileService.getFilesByUserId(this.userService.currentUser.id).subscribe(files => {
        this.testFiles = [];
        this.testFiles = files;
      });
    });
  }

  openCurrentFile(file: FileModel): void {
    this.viewCurrentFile = file;
  }
}
