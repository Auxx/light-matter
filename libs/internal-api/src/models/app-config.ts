import * as __typia_transform__createStandardSchema from 'typia/lib/internal/_createStandardSchema';
import * as __typia_transform__validateReport from 'typia/lib/internal/_validateReport';
export interface AppConfigV1 {
  version: 1;
  gallery: AppConfigV1Gallery;
  system: AppConfigV1System;
}
export interface AppConfigV1Gallery {
  locations: string[];
}
export interface AppConfigV1System {
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
export const isAppConfig = (() => {
  const _io0 = (input: any): boolean =>
    1 === input.version && ('object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery))
    && ('object' === typeof input.system && null !== input.system && false === Array.isArray(input.system)
      && _io2(input.system));
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem);
  const _io2 = (input: any): boolean =>
    undefined === input.bounds || 'object' === typeof input.bounds && null !== input.bounds && _io3(input.bounds);
  const _io3 = (input: any): boolean =>
    'number' === typeof input.x && 'number' === typeof input.y && 'number' === typeof input.width
    && 'number' === typeof input.height;
  return (input: any): input is AppConfigV1 => 'object' === typeof input && null !== input && _io0(input);
})();
export const validateAppConfig = (() => {
  const _io0 = (input: any): boolean =>
    1 === input.version && ('object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery))
    && ('object' === typeof input.system && null !== input.system && false === Array.isArray(input.system)
      && _io2(input.system));
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem);
  const _io2 = (input: any): boolean =>
    undefined === input.bounds || 'object' === typeof input.bounds && null !== input.bounds && _io3(input.bounds);
  const _io3 = (input: any): boolean =>
    'number' === typeof input.x && 'number' === typeof input.y && 'number' === typeof input.width
    && 'number' === typeof input.height;
  const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
    [
      1 === input.version || _report(_exceptionable, {
        path: _path + '.version',
        expected: '1',
        value: input.version
      }),
      ('object' === typeof input.gallery && null !== input.gallery || _report(_exceptionable, {
          path: _path + '.gallery',
          expected: 'AppConfigV1Gallery',
          value: input.gallery
        })) && _vo1(input.gallery, _path + '.gallery', true && _exceptionable) || _report(_exceptionable, {
          path: _path + '.gallery',
          expected: 'AppConfigV1Gallery',
          value: input.gallery
        }),
      ('object' === typeof input.system && null !== input.system && false === Array.isArray(input.system)
          || _report(_exceptionable, {
            path: _path + '.system',
            expected: 'AppConfigV1System',
            value: input.system
          })) && _vo2(input.system, _path + '.system', true && _exceptionable) || _report(_exceptionable, {
          path: _path + '.system',
          expected: 'AppConfigV1System',
          value: input.system
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
  const _vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
    [
      undefined === input.bounds
      || ('object' === typeof input.bounds && null !== input.bounds || _report(_exceptionable, {
          path: _path + '.bounds',
          expected: '(__type | undefined)',
          value: input.bounds
        })) && _vo3(input.bounds, _path + '.bounds', true && _exceptionable)
      || _report(_exceptionable, {
        path: _path + '.bounds',
        expected: '(__type | undefined)',
        value: input.bounds
      })
    ].every((flag: boolean) => flag);
  const _vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
    [
      'number' === typeof input.x || _report(_exceptionable, {
        path: _path + '.x',
        expected: 'number',
        value: input.x
      }),
      'number' === typeof input.y || _report(_exceptionable, {
        path: _path + '.y',
        expected: 'number',
        value: input.y
      }),
      'number' === typeof input.width || _report(_exceptionable, {
        path: _path + '.width',
        expected: 'number',
        value: input.width
      }),
      'number' === typeof input.height || _report(_exceptionable, {
        path: _path + '.height',
        expected: 'number',
        value: input.height
      })
    ].every((flag: boolean) => flag);
  const __is = (input: any): input is AppConfigV1 => 'object' === typeof input && null !== input && _io0(input);
  let errors: any;
  let _report: any;
  return __typia_transform__createStandardSchema._createStandardSchema(
    (input: any): import('typia').IValidation<AppConfigV1> => {
      if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ('object' === typeof input && null !== input || _report(true, {
              path: _path + '',
              expected: 'AppConfigV1',
              value: input
            })) && _vo0(input, _path + '', true) || _report(true, {
              path: _path + '',
              expected: 'AppConfigV1',
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
