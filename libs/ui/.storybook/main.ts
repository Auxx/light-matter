import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [ '../**/*.@(mdx|stories.@(js|jsx|ts|tsx))' ],
  addons: [ '@storybook/addon-docs' ],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  webpackFinal: async (config) => {
    if (config.module === undefined || config.module.rules === undefined || config.module.rules === null) {
      return config;
    }

    const filtered = config.module.rules.map(rule => {

      if (rule instanceof Object
        && (rule.type === 'asset/resource' || rule.type === 'asset/source')
        && rule.test !== undefined) {

        return {
          ...rule,
          test: new RegExp(
            rule.test.toString().replace('svg|', '').slice(1, -1)
          )
        };
      }

      return rule;
    });

    config.module.rules = [
      ...filtered,
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ];

    return config;
  }
};

export default config;
