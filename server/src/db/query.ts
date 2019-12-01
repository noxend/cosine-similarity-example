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
  },
  getJobsByKeys(keys: Array<string>): string {
    return `SELECT 
    j.id,
    j.description,
    j.job_name AS jobName,
    c.company_name AS company,
    c.url AS companyUrl,
    j.url,
    COUNT(DISTINCT k.keyword) AS count,
    GROUP_CONCAT(DISTINCT k.keyword
        SEPARATOR ':|:') AS keywords
  FROM
    k_to_j
        JOIN
    job j ON k_to_j.job_id = j.id
        JOIN
    c_to_j ON c_to_j.job_id = j.id
        JOIN
    company c ON c_to_j.company_id = c.id
        JOIN
    keywords k ON k_to_j.keyword_id = k.id
    WHERE ${keys
      .map((keyword, i) => `(k.keyword LIKE '${keyword}') ${i + 1 !== keys.length ? 'OR' : ''}`)
      .join(' ')}
  GROUP BY j.url
  ORDER BY count DESC;`;
  }
};
