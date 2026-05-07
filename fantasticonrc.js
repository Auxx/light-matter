module.exports = {
  inputDir: './node_modules/@fluentui/svg-icons/icons',
  outputDir: './apps/web/public/icons',
  fontTypes: [ 'ttf', 'woff', 'woff2' ],
  assetTypes: [ 'ts', 'css' ],
  fontsUrl: '/icons',
  selector: 'ui-icon',
  formatOptions: {
    ts: {
      types: [ 'enum', 'constant' ],
      singleQuotes: true,
      enumName: 'IconType',
      constantName: 'IconCodepoints'
    }
  },
  pathOptions: {
    ts: './apps/web/src/ui/components/icon/icon.types.ts',
    css: './apps/web/src/icons.scss'
  }
};
