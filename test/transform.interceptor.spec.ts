import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from '../src/transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor;
  let executionContext: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    executionContext = {} as ExecutionContext;
    callHandler = {
      handle: jest.fn().mockReturnValue(of({ key: 'value' })),
    };
  });

  it('should transform the response', (done) => {
    interceptor.intercept(executionContext, callHandler).subscribe((result) => {
      expect(result).toEqual({ data: { key: 'value' } });
      done();
    });
  });
});
