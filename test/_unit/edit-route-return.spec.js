const EditRouteReturn = require('../../apps/acrs/behaviours/edit-route-return');

class SuperClass {}
const isContinueOnEdit = (new (EditRouteReturn(SuperClass))).isContinueOnEdit;

describe('isContinueOnEdit', () => {
  it('should return false if options.continueOnEdit is falsy', () => {
    const values = { 'hof-field-A': 'some-input' };

    let options = {};
    let result = isContinueOnEdit(options, values);
    expect(result).to.be.false;

    options = { continueOnEdit: false };
    result = isContinueOnEdit(options, values);
    expect(result).to.be.false;
  });

  it('should return true if options.continueOnEdit is truthy', () => {
    const values = { 'hof-field-A': 'some-input' };

    options = { continueOnEdit: true };
    result = isContinueOnEdit(options, values);
    expect(result).to.be.true;
  });

  it('should return true if a matching choice with continueOnEdit is found', () => {
    const options = {
      forks: [
        {
          condition: {
            field: 'hof-field-A',
            value: 'some-input'
          },
          continueOnEdit: true
        }
      ]
    };
    const values = { 'hof-field-B': 'other-stuff', 'hof-field-A': 'some-input'};
    const result = isContinueOnEdit(options, values);

    expect(result).to.be.true;
  });

  it('should return false if no matching choice is found', () => {
    const options = {
      forks: [
        {
          condition: {
            field: 'hof-field-A',
            value: 'some-input'
          },
          continueOnEdit: true
        }
      ]
    };
    const values = { 'hof-field-A': 'different-input' };
    const result = isContinueOnEdit(options, values);

    expect(result).to.be.false;
  });

  it('should return false if a matching choice is found but continueOnEdit is falsy', () => {
    const options = {
      forks: [
        {
          condition: {
            field: 'hof-field-A',
            value: 'some-input'
          }
        }
      ]
    };
    const values = { 'hof-field-A': 'some-input'};
    const result = isContinueOnEdit(options, values);

    expect(result).to.be.false;
  });
});
