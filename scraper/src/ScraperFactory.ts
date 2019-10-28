import RobotaUA from './RobotaUA';
import WorkUA from './WorkUA';
import config from './config';

export default class ScraperFactory {
  static crate(service: 'robotaua' | 'workua') {
    switch (service) {
      case 'robotaua':
        return new RobotaUA(config.service[service]);
      case 'workua':
        return new WorkUA(config.service[service]);
      default:
        throw TypeError("Non-existent service. Available service: 'workua, robotaua'");
    }
  }
}
