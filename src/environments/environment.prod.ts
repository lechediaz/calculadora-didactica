export const environment = {
  production: true,
  config: {
    key: 'config',
    maxPossibleValue: 150,
    minPossibleValue: -150,
    operators: [
      { name: 'Suma', sign: '+' },
      { name: 'Resta', sign: '-' },
      { name: 'Multiplicación', sign: '*' },
      { name: 'División', sign: '/' },
    ],
  },
};
