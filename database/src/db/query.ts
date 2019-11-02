interface IJobData {
  city?: string;
  company?: string;
  jobName?: string;
  number?: string;
  contactPerson?: string;
  url?: string;
  keywords?: string;
  address?: string;
  phone?: string;
  site?: string;
  salary?: string;
}

export default {
  selectJob(): string {
    return 'SELECT * FROM jobs LIMIT 500';
  },
  insertJob({
    jobName,
    company,
    city,
    number,
    contactPerson,
    url,
    keywords,
    address,
    phone,
    site,
    salary
  }: IJobData): string {
    return `INSERT INTO jobs (jobName, company, city, number, contactPerson, url, keywords, address, phone, site, salary) VALUES ('${jobName}', '${company}', '${city}', '${number}', '${contactPerson}', '${url}', '${keywords}', '${address}', '${phone}', '${site}', '${salary}');`;
  },
  insertKeyword(keyword: string): string {
    return `INSERT IGNORE INTO keywords (keyword) VALUES ('${keyword}');`;
  }
};
