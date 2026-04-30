import { DefaultPipe } from './default.pipe';

describe('DefaultPipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return default value when input is null', () => {
    const pipe = new DefaultPipe();
    expect(pipe.transform(null, 'default')).toBe('default');
  });

  it('should return default value when input is undefined', () => {
    const pipe = new DefaultPipe();
    expect(pipe.transform(undefined, 42)).toBe(42);
  });

  it('should return the value when it is not null or undefined', () => {
    const pipe = new DefaultPipe();
    expect(pipe.transform('hello', 'default')).toBe('hello');
  });
});
