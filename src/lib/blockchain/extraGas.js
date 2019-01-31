const { REACT_APP_ENVIRONMENT = 'localhost' } = process.env;
// need to supply extraGas b/c https://github.com/trufflesuite/ganache-core/issues/26
export default () => {
  switch (REACT_APP_ENVIRONMENT) {
    case 'localhost':
      return 1000000;
    case 'rsk_testnet':
      return 100000;
    default:
      return 0;
  }
};
