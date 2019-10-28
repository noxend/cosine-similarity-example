import IJobData from './IJobData';
export default abstract class ScraperAbstract {
  abstract async getJobsUrl(): Promise<Array<IJobData>>;
  abstract async getDetails(data: IJobData): Promise<IJobData>;
}
