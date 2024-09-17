import { Test, TestingModule } from '@nestjs/testing';
import { CustomLoggerService } from '../../src/services/logger-service';

describe('CustomLoggerService', () => {
  let service: CustomLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomLoggerService],
    }).compile();

    service = module.get<CustomLoggerService>(CustomLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a message', () => {
    const logSpy = jest.spyOn(service, 'log');
    const message = 'Test log message';
    service.log(message);
    expect(logSpy).toHaveBeenCalledWith(message);
  });

  it('should log an error message with trace', () => {
    const errorSpy = jest.spyOn(service, 'error');
    const message = 'Test error message';
    const trace = 'Test trace';
    service.error(message, trace);
    expect(errorSpy).toHaveBeenCalledWith(message, trace);
  });

  it('should log a warning message', () => {
    const warnSpy = jest.spyOn(service, 'warn');
    const message = 'Test warn message';
    service.warn(message);
    expect(warnSpy).toHaveBeenCalledWith(message);
  });

  it('should log a debug message', () => {
    const debugSpy = jest.spyOn(service, 'debug');
    const message = 'Test debug message';
    service.debug(message);
    expect(debugSpy).toHaveBeenCalledWith(message);
  });

  it('should log a verbose message', () => {
    const verboseSpy = jest.spyOn(service, 'verbose');
    const message = 'Test verbose message';
    service.verbose(message);
    expect(verboseSpy).toHaveBeenCalledWith(message);
  });
});
