import querystring from "querystring";
import request from 'request';

export class Nobitex {
  /**
   * @param {boolean} testnet
   * @param {string} key
   * @param {string} secret
   */
  constructor(token) {
    this.token = token;
    this.apiUrl = 'https://api.nobitex.ir'
    if (!this.token) throw new Error("No Nobitex API Key found in .env");
  }


  /**
   * Get account information
   * @returns {object} account information
   */
  async getAccountInfo() {
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        const options = {
          method: 'GET',
          url: `${self.apiUrl}/users/profile`,
          headers: {
            'Authorization': `Token ${self.token}`
          }
        };
        request(options, async function (error, response) {
          if (error) reject(error);
          resolve(JSON.parse(response.body));
        });
      } catch (error) {
        reject(error);
      }
    })

  }

  /**
   * Create a market buy order
   * @param {string} symbol
   * @param {string} quantity
   * @param {string} quoteOrderQty
   */
  async marketBuy(assert, currency, quantity, quoteOrderQty) {
    const self = this;
    return new Promise(resolve => {
      try {
        const params = {
          srcCurrency: assert,
          dstCurrency: currency,
          type: 'buy',
          mode:'default',
          execution: 'limit',//or market
          price:'500000' //todo remove key for market execution
        }
        if (quoteOrderQty) params.amount = quoteOrderQty;
        //if (quantity) params.price = quantity;//todo
        const url = `${self.apiUrl}/market/orders/add`;
        const options = {
          method: 'POST',
          url,
          headers: {'Authorization': `Token ${self.token}`},
          formData:params
        };
        request(options, async function (error, response) {
          if (error) console.error(error);
          resolve(JSON.parse(response.body))
        });

      } catch (error) {
        console.error(error);
      }
    })


  }
}
