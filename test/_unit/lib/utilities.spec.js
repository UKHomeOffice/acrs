const assert = require('chai').assert;
const { calcDateBefore, isOver18, generateUniqueReference } = require('../../../lib/utilities');

describe('calcDateBefore function', () => {
  it('should return true if the date is before the cutoff date', () => {
    const date = '2022-01-01';
    const cutoff = '2023-01-01';
    const format = 'YYYY-MM-DD';
    assert.isTrue(calcDateBefore(date, cutoff, format));
  });

  it('should return false if the date is after the cutoff date', () => {
    const date = '2022-01-01';
    const cutoff = '2021-01-01';
    const format = 'YYYY-MM-DD';
    assert.isFalse(calcDateBefore(date, cutoff, format));
  });
});

describe('isOver18 function', () => {
  it('should return true if the date of birth is over 18 years old', () => {
    const dateOfBirth = '1990-01-01';
    assert.isTrue(isOver18(dateOfBirth));
  });

  it('should return false if the date of birth is under 18 years old', () => {
    const dateOfBirth = '2010-01-01';
    assert.isFalse(isOver18(dateOfBirth));
  });
});

describe('generateUniqueReference function', () => {
  it('should return a string of the length supplied', async () => {
    const generatedRef = await generateUniqueReference(6, 'ABC');
    expect(generatedRef).to.have.lengthOf(6);
  });

  it('should return a string containing only the supplied characters', async () => {
    let generatedRef = await generateUniqueReference(3, 'A');
    expect(generatedRef).to.equal('AAA');
    generatedRef = await generateUniqueReference(12, 'B');
    expect(generatedRef).to.equal('BBBBBBBBBBBB');
  });
});
