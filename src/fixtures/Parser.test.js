const parser = require('./Parser').default

describe('Fixture Parser', () => {
	describe('Payments', () => {
		it('should fail for unknown type', () => {
			expect(()=>parser.parsePayment('UNKNOWN', {})).toThrow('no such file')
		})

		it('should be able to parse SEPA', () => {
			const paymentBody = parser.parsePayment('SEPA', {debtorAccount: 'MY-ACCOUNT-IBAN'})
			expect(paymentBody).toContain('"iban": "MY-ACCOUNT-IBAN"')
			expect(()=>JSON.parse(paymentBody)).not.toThrow()
		})

		it('should be able to parse SEPA-FUTURE', () => {
			const paymentBody = parser.parsePayment('SEPA-FUTURE', {debtorAccount: 'MY-ACCOUNT-IBAN'})
			expect(paymentBody).toContain('"iban": "MY-ACCOUNT-IBAN"')
			expect(()=>JSON.parse(paymentBody)).not.toThrow()
		})

		it('should be able to parse SEPA-INST', () => {
			const paymentBody = parser.parsePayment('SEPA-INST', {debtorAccount: 'MY-ACCOUNT-IBAN'})
			expect(paymentBody).toContain('"iban": "MY-ACCOUNT-IBAN"')
			expect(()=>JSON.parse(paymentBody)).not.toThrow()
		})

		it('should be able to parse INTP', () => {
			const paymentBody = parser.parsePayment('INTP', {debtorAccount: 'MY-ACCOUNT-IBAN'})
			expect(paymentBody).toContain('"iban": "MY-ACCOUNT-IBAN"')
			expect(()=>JSON.parse(paymentBody)).not.toThrow()
		})
	})
})