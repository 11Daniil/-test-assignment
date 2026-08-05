module.exports = (api) => {
  const isTest = api.env('test');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          bugfixes: true,
          modules: isTest ? 'commonjs' : false,
          useBuiltIns: false,
        },
      ],
    ],
  };
};
