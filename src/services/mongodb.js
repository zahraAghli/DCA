import mongodb from 'mongodb';
import colors from "colors";
const { MongoClient } = mongodb;

export class MongoDb {
	/**
	 * @param {string} uri 
	 */
	constructor(uri) {
		if (!uri) {
			return;
		}

		this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	}

	/**
	 * 
	 * @param {object} order
	 */
	async saveOrder(order) {
		if (!this.client) {
			return;
		}

		try {
			await this.client.connect();
			console.log(colors.magenta("Successfully connected to MongoDB database."));
			await this.client.db("nobitex_dca").collection("orders").insertOne(order);
		} catch (e) {
			console.error(e);
		} finally {
			await this.client.close();
		}
	}
}
