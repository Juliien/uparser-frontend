export class GradeModel {
  id: string;
  codeId: string;
  runId: string;
  indentationGrade: number;
  indentationErrMessages: string[];
  functionLengthGrade: number;
  functionLengthErrMessages: string[];
  lineLengthGrade: number;
  lineLengthErrMessages: string[];
  namingVarGrade: number;
  namingVarErrMessages: string[];
  namingClassGrade: number;
  namingClassErrMessages: string[];
  importGrade: number;
  importErrMessages: string[];
  functionDepthGrade: number;
  functionDepthMessages: string[];
}
