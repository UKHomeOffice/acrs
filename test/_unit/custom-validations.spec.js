const { isInCountriesList } = require('../../apps/acrs/fields/index');

describe('Validation', () => {
  describe('isInCountriesList', () => {
    it('Returns true for a country in the list', () => {
      expect(isInCountriesList('Unknown')).to.equal(true);
    });

    it('Returns false for a country not in the list', () => {
      expect(isInCountriesList('Nowhere')).to.equal(false);
    });

    it('Returns false for an incorrect type of value', () => {
      expect(isInCountriesList(undefined)).to.equal(false);
    });
  });
});
