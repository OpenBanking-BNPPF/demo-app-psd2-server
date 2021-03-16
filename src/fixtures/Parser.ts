import * as replace from 'simple-placeholder-replacer'
import { readFileSync } from 'fs';


class Parser {

	parsePayment(type: string, replacementMap: any): string {
		const paymentTemplate = readFileSync(`${__dirname}/payments/${type}.json`, {encoding:'utf8'});
		return replace(paymentTemplate, replacementMap)
	}
}

export default new Parser()