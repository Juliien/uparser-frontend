import {GradeModel} from './garde.model';

export class CodeModel {
  id: string;
  userId: string;
  gradeId: GradeModel;
  codeEncoded: string;
  extensionStart: string;
  extensionEnd: string;
  hash: string;
  language: string;
  codeMark: number;
  plagiarism: boolean;
  enable: boolean;
  date: Date;
}
