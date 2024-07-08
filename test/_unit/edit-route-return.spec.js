const EditRouteReturn = require('../../apps/acrs/behaviours/edit-route-return');

class SuperClass {}
const objEditRouteReturn = (new (EditRouteReturn(SuperClass)));

describe('isContinueOnEdit', () => {
  it('should return false if options.continueOnEdit is falsy', () => {
    const req = {
      form: {
        values: {
          'hof-field-A': 'some-input'
        },
        options: {}
      }
    };
    let result = objEditRouteReturn.isContinueOnEdit(req);
    expect(result).to.be.false;

    req.form.options.continueOnEdit = false;
    result = objEditRouteReturn.isContinueOnEdit(req);
    expect(result).to.be.false;
  });

  it('should return true if options.continueOnEdit is truthy', () => {
    const req = {
      form: {
        values: { 'hof-field-A': 'some-input' },
        options: { continueOnEdit: true }
      }
    };
    const result = objEditRouteReturn.isContinueOnEdit(req);
    expect(result).to.be.true;
  });

  it('should return true if a matching choice with continueOnEdit is found', () => {
    const req = {
      form: {
        values: { 'hof-field-B': 'other-stuff', 'hof-field-A': 'some-input'},
        options: {
          forks: [
            {
              condition: {
                field: 'hof-field-A',
                value: 'some-input'
              },
              continueOnEdit: true
            }
          ]
        }
      }
    };
    const result = objEditRouteReturn.isContinueOnEdit(req);
    expect(result).to.be.true;
  });

  it('should return true if a matching choice with continueOnEdit is found whose condition is function', () => {
    const req = {
      form: {
        values: { 'hof-field-B': 'other-stuff', 'hof-field-A': 'some-input'},
        options: {
          forks: [
            {
              condition: (req) => true,
              continueOnEdit: true
            }
          ]
        }
      }
    };
    const result = objEditRouteReturn.isContinueOnEdit(req);

    expect(result).to.be.true;
  });

  it('should return false if no matching choice is found', () => {
    const req = {
      form: {
        values: { 'hof-field-A': 'different-input' },
        options: {
          forks: [
            {
              condition: {
                field: 'hof-field-A',
                value: 'some-input'
              },
              continueOnEdit: true
            }
          ]
        }
      }
    };
    const result = objEditRouteReturn.isContinueOnEdit(req);

    expect(result).to.be.false;
  });

  it('should return false if a matching choice is found but continueOnEdit is falsy', () => {
    const req = {
      form: {
        values: { 'hof-field-A': 'some-input' },
        options: {
          forks: [
            {
              condition: {
                field: 'hof-field-A',
                value: 'some-input'
              },
              continueOnEdit: false
            }
          ]
        }
      }
    };
    const result = objEditRouteReturn.isContinueOnEdit(req);

    expect(result).to.be.false;
  });
});

describe('isForkSelected', () => {
  it('should return the true when condition is a function that is fulfilled', () => {
    const condition = (req) => {
      return req.form.values.parent === 'yes' && 
        req.session.aggregatedValues.length === 0;
    };
    const req = {
      form: {
        values: {
          'parent': 'yes'
        }
      },
      session: {
        aggregatedValues: []
      }
    };
    const result = objEditRouteReturn.isForkSelected(condition, req);
    expect(result).to.be.true;
  });

  it('should return false when condition is a function that is not fulfilled', () => {
    const condition = (req) => {
      return req.form.values.parent === 'yes' && 
        req.session.aggregatedValues.length === 0;
    };
    const req = {
      form: {
        values: {
          'parent': 'yes'
        }
      },
      session: {
        aggregatedValues: ['not-empty']
      }
    };
    const result = objEditRouteReturn.isForkSelected(condition, req);
    expect(result).to.be.false;
  });

  it('should return true when condition is an object field/value that is matched by values', () => {
    const condition = {
      field: 'hof-field-A',
      value: 'some-input'
    };
    const req = {
      form: {
        values: {
          'hof-field-A': 'some-input'
        }
      }
    };
    const result = objEditRouteReturn.isForkSelected(condition, req);
    expect(result).to.be.true;
  });

  it('should return false when condition is an object field/value that is not matched by values', () => {
    const condition = {
      field: 'hof-field-A',
      value: 'different-input'
    };
    const req = {
      form: {
        values: {
          'hof-field-A': 'some-input'
        }
      }
    };
    const result = objEditRouteReturn.isForkSelected(condition, req);
    expect(result).to.be.false;
  });  
});