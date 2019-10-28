import IJobData from '../IJobData';

export default {
  insertJob({
    jobName,
    company,
    city,
    number,
    contactPerson,
    url,
    skils,
    address,
    phone,
    site,
    salary
  }: IJobData): string {
    return `INSERT INTO jobs (jobName, company, city, number, contactPerson, url, skils, address, phone, site, salary) VALUES ('${jobName}', '${company}', '${city}', '${number}', '${contactPerson}', '${url}', '${skils}', '${address}', '${phone}', '${site}', '${salary}');`;
  },
  insertKeyword(keyword: string): string {
    return `INSERT IGNORE INTO skills (skill) VALUES ('${keyword}');`;
  }
};
