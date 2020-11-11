import { store } from '../store';
import { addExchangeRate } from '../reducers/exchangeRatesSlice';

/**
 * Clase utilitaria para el manejo de exchange rates a través de Redux.
 */
class ExchangeRateUtils {

  constructor() { }
  /**
   * @param data datos del exchange rate. should be an instance of ExchangeRate
   */
  addExchangeRate(exchangeRate) { 
    const action = addExchangeRate(exchangeRate)
    store.dispatch(action);
  }
}

export default new ExchangeRateUtils();
