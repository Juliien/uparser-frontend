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
import {CodeHistoryModel} from '../../models/code-history.model';
import {RunStatsModel} from '../../models/run-stats.model';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements AfterViewInit, OnInit {
  @ViewChild('editor') editor;
  languages = ['python', 'C'];
  themes = ['twilight', 'dracula', 'xcode', 'eclipse'];
  selectedLang = 'python';
  selectedTheme = 'twilight';
  codeHistory: CodeHistoryModel[] = [];
  runnerOutput: RunnerOutputModel;
  selectedFile: FileModel;
  viewCurrentFile: FileModel;
  testFiles: FileModel[];
  extensionType: string;
  errorMessage: string;
  backendArtifact: string;
  spinner = false;
  exampleCode = `import sys

with open(sys.argv[1]) as file:
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
        // this.codeEditorService.parseFile(data).subscribe(res => this.backendArtifact = res);
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

      if (this.runnerOutput.stderr === '' && this.selectedFile) {
        const checkCode = {
          userId: this.userService.currentUser.id,
          extensionStart: this.selectedFile.fileExtension,
          extensionEnd: this.extensionType,
          language: this.selectedLang,
          codeEncoded: btoa(this.editor.value),
        };

        // test if user code is not a copied
        this.codeEditorService.isCodePlagiarism(checkCode).subscribe(code => {
          // test if quality of code
          this.codeEditorService.testCodeQuality(code).subscribe(codeQualityResult => {
            // save code
            this.codeEditorService.addCode(codeQualityResult).subscribe((codeResult) => {
              // set runner_codeId
              this.runnerOutput.codeId = codeResult.id;
              // save run
              this.codeEditorService.addRun(this.runnerOutput).subscribe((runModel) => this.runnerOutput = runModel);

              const codeHistory = {
                userId: codeResult.userId,
                codeEncoded: codeResult.codeEncoded,
                language: codeResult.language,
                date: codeResult.date
              };
              // save on user history
              this.codeEditorService.addCodeHistory(codeHistory).subscribe(history => this.codeHistory.push(history));

              // backend artifact == runner artifact
              if (codeResult.codeMark > 5 && codeResult.isPlagiarism === false) {
                // enable for catalog
                this.codeEditorService.enableCodeToCatalog(codeResult).subscribe();
              }
            });
          });
        });
      }
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

  updateCode(code: CodeHistoryModel): void {
    if (code != null) {
      this.editor.value = atob(code.codeEncoded);
      this.selectedLang = code.language;
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

  deleteHistory(id: string): void {
    this.codeEditorService.deleteCodeHistory(id).subscribe(() => {
      this.codeEditorService.getUserCodeHistory().subscribe(history => {
        this.codeHistory = [];
        this.codeHistory = history;
      });
    });
  }
  deleteAllHistory(): void {
    this.codeEditorService.deleteAllUserCodeHistory().subscribe(() => this.codeHistory = []);
  }
}
