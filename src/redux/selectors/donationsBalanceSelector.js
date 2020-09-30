import { createSelector } from 'reselect'
import { selectDonationsByIds } from '../reducers/donationsSlice';
import BigNumber from 'bignumber.js';

const totalBalanceReducer = (totalBalance, donation) => {
  return BigNumber.sum(totalBalance, donation.amountRemainding);
};

const makeSelectDonationsBalance = () => {
  return createSelector(
    [selectDonationsByIds],
    (donations) => {
      return new BigNumber(donations.reduce(totalBalanceReducer, 0));
    }
  )
}

export default makeSelectDonationsBalance;