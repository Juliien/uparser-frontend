import {RunStatsModel} from './run-stats.model';

export class RunnerOutputModel {
  id: string;
  artifact: string;
  codeId: string;
  userId: string;
  stats: RunStatsModel;
  stderr: string;
  stdout: string;
  creationDate: string;
}
