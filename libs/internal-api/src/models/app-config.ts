import * as __typia_transform__createStandardSchema from 'typia/lib/internal/_createStandardSchema';
import * as __typia_transform__validateReport from 'typia/lib/internal/_validateReport';
export interface AppConfig {
  gallery: {
    locations: string[];
  };
}
export const isAppConfig = (() => {
  const _io0 = (input: any): boolean =>
    'object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery);
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem);
  return (input: any): input is AppConfig => 'object' === typeof input && null !== input && _io0(input);
})();
export const validateAppConfig = (() => {
  const _io0 = (input: any): boolean =>
    'object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery);
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem);
  const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
    [
      ('object' === typeof input.gallery && null !== input.gallery || _report(_exceptionable, {
          path: _path + '.gallery',
          expected: '__type',
          value: input.gallery
        })) && _vo1(input.gallery, _path + '.gallery', true && _exceptionable) || _report(_exceptionable, {
          path: _path + '.gallery',
          expected: '__type',
          value: input.gallery
        })
    ].every((flag: boolean) => flag);
  const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
    [
      (Array.isArray(input.locations) || _report(_exceptionable, {
          path: _path + '.locations',
          expected: 'Array<string>',
          value: input.locations
        })) && input.locations.map((elem: any, _index2: number) =>
          'string' === typeof elem || _report(_exceptionable, {
            path: _path + '.locations[' + _index2 + ']',
            expected: 'string',
            value: elem
          })
        ).every((flag: boolean) => flag) || _report(_exceptionable, {
          path: _path + '.locations',
          expected: 'Array<string>',
          value: input.locations
        })
    ].every((flag: boolean) => flag);
  const __is = (input: any): input is AppConfig => 'object' === typeof input && null !== input && _io0(input);
  let errors: any;
  let _report: any;
  return __typia_transform__createStandardSchema._createStandardSchema(
    (input: any): import('typia').IValidation<AppConfig> => {
      if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ('object' === typeof input && null !== input || _report(true, {
              path: _path + '',
              expected: 'AppConfig',
              value: input
            })) && _vo0(input, _path + '', true) || _report(true, {
              path: _path + '',
              expected: 'AppConfig',
              value: input
            }))(input, '$input', true);
        const success = 0 === errors.length;
        return success
          ? {
            success,
            data: input
          }
          : {
            success,
            errors,
            data: input
          } as any;
      }
      return {
        success: true,
        data: input
      } as any;
    }
  );
})();
