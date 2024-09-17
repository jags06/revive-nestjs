import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
  log(message: string) {
    // Add your custom log logic here
    super.log(message);
  }

  error(message: string, trace: string) {
    // Add your custom error logic here
    super.error(message, trace);
  }

  warn(message: string) {
    // Add your custom warn logic here
    super.warn(message);
  }

  debug(message: string) {
    // Add your custom debug logic here
    super.debug(message);
  }

  verbose(message: string) {
    // Add your custom verbose logic here
    super.verbose(message);
  }
}
