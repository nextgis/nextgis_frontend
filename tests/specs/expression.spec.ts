import { expect } from 'chai';
import { evaluate, isExpression } from '../../packages/expression/src';

describe('Get Expression', () => {
  const prop = {
    foo: 'bar',
    nested: { key: 'value' },
    key: 'foo',
  };

  it('should get value from data using key', () => {
    expect(evaluate(prop, ['get', 'foo'])).to.equal('bar');
    expect(evaluate(prop, ['get', 'nested'])).to.eql({ key: 'value' });
  });

  it('should get value from evaluated object using key', () => {
    expect(evaluate(prop, ['get', 'key', ['get', 'nested']])).to.equal('value');
  });

  it('should return undefined for nonexistent keys', () => {
    expect(evaluate(prop, ['get', 'nonexistent'])).to.be.undefined;
  });
});

describe('Lookup Expressions', () => {
  const prop = {
    str: 'Hello World',
    arr: [1, 2, 3, 4, 5],
    obj: { key: 'value' },
    hello: 'Hello',
    two: 2,
  };

  // Testing for 'at'
  it('should return item at specific index from array or string', () => {
    expect(evaluate(prop, ['at', ['get', 'arr'], 1])).to.equal(2);
    expect(evaluate(prop, ['at', ['get', 'str'], 4])).to.equal('o');
  });

  // Testing for 'has'
  it('should check if item exists in array or string', () => {
    expect(evaluate(prop, ['has', ['get', 'arr'], ['get', 'two']])).to.be.true;
    expect(evaluate(prop, ['has', ['get', 'str'], ['get', 'hello']])).to.be
      .true;
  });

  // Testing for 'length'
  it('should return length of array or string', () => {
    expect(evaluate(prop, ['length', ['get', 'arr']])).to.equal(5);
    expect(evaluate(prop, ['length', ['get', 'str']])).to.equal(11);
  });

  // Testing for 'in'
  it('should test presence in array', () => {
    expect(evaluate(prop, ['in', ['get', 'two'], ['get', 'arr']])).to.be.true;
    expect(evaluate(prop, ['in', 6, ['get', 'arr']])).to.be.false;
  });

  it('should test presence in string', () => {
    expect(evaluate(prop, ['in', ['get', 'hello'], ['get', 'str']])).to.be.true;
    expect(evaluate(prop, ['in', 'Bye', ['get', 'str']])).to.be.false;
  });

  // Testing for 'index-of'
  it('should find index in array', () => {
    expect(
      evaluate(prop, ['index-of', ['get', 'arr'], ['get', 'two']]),
    ).to.equal(1);
  });

  it('should find index in string', () => {
    expect(
      evaluate(prop, ['index-of', ['get', 'str'], ['get', 'hello']]),
    ).to.equal(0);
    expect(evaluate(prop, ['index-of', ['get', 'str'], 'Bye'])).to.equal(-1);
  });

  // Testing for 'slice'
  it('should slice array', () => {
    expect(evaluate(prop, ['slice', ['get', 'arr'], 1, 4])).to.deep.equal([
      2, 3, 4,
    ]);
  });

  it('should slice string', () => {
    expect(evaluate(prop, ['slice', ['get', 'str'], 0, 5])).to.equal('Hello');
  });
});

describe(`Expression`, () => {
  const prop = {
    zero: 0,
    two: 2,
    str: 'Foo Bar',
    true: true,
    false: false,
    large: 100,
    small: 0.5,
    nullValue: null,
    undefinedValue: undefined,
  };

  it('match', () => {
    expect(
      evaluate(prop, ['match', ['get', 'two'], 2, 'matched', 'not matched']),
    ).to.be.equal('matched');
    expect(
      evaluate(prop, [
        'match',
        ['get', 'str'],
        'Foo',
        'matched',
        'not matched',
      ]),
    ).to.be.equal('not matched');
  });

  it('case', () => {
    expect(
      evaluate(prop, [
        'case',
        ['==', ['get', 'two'], 2],
        'true branch',
        'false branch',
      ]),
    ).to.be.equal('true branch');
    expect(
      evaluate(prop, [
        'case',
        ['==', ['get', 'str'], 'Foo'],
        'true branch',
        'false branch',
      ]),
    ).to.be.equal('false branch');
  });

  it('step', () => {
    expect(
      evaluate(prop, ['step', ['get', 'large'], 50, 10, 'low', 100, 'high']),
    ).to.be.equal('high');
    expect(
      evaluate(prop, [
        'step',
        ['get', 'small'],
        50,
        0.2,
        'low',
        1,
        'medium',
        100,
        'high',
      ]),
    ).to.be.equal('low');
  });

  it(`coalesce`, () => {
    expect(
      evaluate(prop, [
        'coalesce',
        ['get', 'nullValue'],
        ['get', 'undefinedValue'],
        ['get', 'str'],
      ]),
    ).to.be.equal('Foo Bar');
    expect(
      evaluate(prop, [
        'coalesce',
        ['get', 'nullValue'],
        ['get', 'two'],
        ['get', 'str'],
      ]),
    ).to.be.equal(2);
    expect(
      evaluate(prop, [
        'coalesce',
        ['get', 'nullValue'],
        ['get', 'undefinedValue'],
        ['get', 'false'],
      ]),
    ).to.be.equal(false);
  });

  it('not', () => {
    expect(evaluate(prop, ['!', ['get', 'true']])).to.be.false;
    expect(evaluate(prop, ['!', ['get', 'false']])).to.be.true;
  });

  // Test for relational operators
  it('relational', () => {
    expect(evaluate(prop, ['==', ['get', 'two'], 2])).to.be.true;
    expect(evaluate(prop, ['!=', ['get', 'two'], 3])).to.be.true;
    expect(evaluate(prop, ['<', ['get', 'two'], 3])).to.be.true;
    expect(evaluate(prop, ['<=', ['get', 'two'], 2])).to.be.true;
    expect(evaluate(prop, ['>', ['get', 'two'], 1])).to.be.true;
    expect(evaluate(prop, ['>=', ['get', 'two'], 2])).to.be.true;
  });

  it('all and any', () => {
    expect(evaluate(prop, ['all', ['get', 'true'], ['==', ['get', 'two'], 2]]))
      .to.be.true;
    expect(evaluate(prop, ['any', ['get', 'false'], ['==', ['get', 'two'], 2]]))
      .to.be.true;
  });

  it('isExpression', () => {
    expect(isExpression(['get', 'two'])).to.be.true;
    expect(isExpression(['get'])).to.be.false;
    expect(isExpression(['unknown', 'two'])).to.be.false;
  });
});

describe('Mathematical Expressions', () => {
  const prop = {
    a: 2,
    b: 3,
    c: -5,
    d: 2.3,
    e: 2.7,
    f: 1,
    g: 0,
    h: 8,
    i: 2.5,
    j: 0.5,
  };

  it('adds numbers', () => {
    expect(evaluate(prop, ['+', ['get', 'a'], ['get', 'b'], 1])).to.equal(6);
  });

  it('subtracts numbers', () => {
    expect(evaluate(prop, ['-', ['get', 'h'], ['get', 'a']])).to.equal(6);
  });

  it('multiplies numbers', () => {
    expect(evaluate(prop, ['*', ['get', 'a'], ['get', 'b']])).to.equal(6);
  });

  it('divides numbers', () => {
    expect(evaluate(prop, ['/', ['get', 'h'], ['get', 'a']])).to.equal(4);
  });

  it('calculates modulo', () => {
    expect(evaluate(prop, ['%', ['get', 'h'], ['get', 'b']])).to.equal(2);
  });

  it('calculates power', () => {
    expect(evaluate(prop, ['^', ['get', 'a'], ['get', 'b']])).to.equal(8);
  });

  it('calculates absolute', () => {
    expect(evaluate(prop, ['abs', ['get', 'c']])).to.equal(5);
  });

  it('calculates acos', () => {
    expect(evaluate(prop, ['acos', ['get', 'f']])).to.equal(0);
  });

  it('calculates asin', () => {
    expect(evaluate(prop, ['asin', ['get', 'g']])).to.equal(0);
  });

  it('calculates atan', () => {
    expect(evaluate(prop, ['atan', ['get', 'f']])).to.be.closeTo(
      Math.PI / 4,
      0.0001,
    );
  });

  it('calculates ceil', () => {
    expect(evaluate(prop, ['ceil', ['get', 'd']])).to.equal(3);
  });

  it('calculates cosine', () => {
    expect(evaluate(prop, ['cos', Math.PI])).to.equal(-1);
  });

  it('returns Euler number', () => {
    expect(evaluate(prop, ['e'])).to.equal(Math.E);
  });

  it('calculates floor', () => {
    expect(evaluate(prop, ['floor', ['get', 'e']])).to.equal(2);
  });
});

describe('Type Expressions', () => {
  const prop = {
    num: 123,
    str: 'Hello World',
    arr: [1, 2, 3],
    bool: true,
    obj: { key: 'value' },
    nullVal: null,
    undefinedVal: undefined,
  };

  // Testing for 'array'
  it('should return array if arg is array', () => {
    expect(evaluate(prop, ['array', ['get', 'arr']])).to.deep.equal([1, 2, 3]);
  });
  it('should fail if arg is not an array', () => {
    expect(() => evaluate(prop, ['array', ['get', 'num']])).to.throw();
  });
  it('should return the first valid array', () => {
    expect(
      evaluate(prop, ['array', ['get', 'num'], ['get', 'str'], ['get', 'arr']]),
    ).to.deep.equal([1, 2, 3]);
  });

  // Testing for 'boolean'
  it('should return boolean if arg is boolean', () => {
    expect(evaluate(prop, ['boolean', ['get', 'bool']])).to.equal(true);
  });
  it('should fail if arg is not a boolean', () => {
    expect(() => evaluate(prop, ['boolean', ['get', 'str']])).to.throw();
  });
  it('should return the first valid boolean', () => {
    expect(
      evaluate(prop, [
        'boolean',
        ['get', 'num'],
        ['get', 'str'],
        ['get', 'bool'],
      ]),
    ).to.equal(true);
  });

  // Testing for 'literal'
  it('should return arg as it is', () => {
    expect(evaluate(prop, ['literal', ['get', 'str']])).to.equal('Hello World');
  });

  // Testing for 'number'
  it('should return number if arg is number', () => {
    expect(evaluate(prop, ['number', ['get', 'num']])).to.equal(123);
  });
  it('should fail if arg is not a number', () => {
    expect(() => evaluate(prop, ['number', ['get', 'str']])).to.throw();
  });
  it('should return the first valid number', () => {
    expect(
      evaluate(prop, [
        'number',
        ['get', 'str'],
        ['get', 'arr'],
        ['get', 'num'],
      ]),
    ).to.equal(123);
  });

  // Testing for 'object'
  it('should return object if arg is object', () => {
    expect(evaluate(prop, ['object', ['get', 'obj']])).to.deep.equal({
      key: 'value',
    });
  });
  it('should fail if arg is not an object', () => {
    expect(() => evaluate(prop, ['object', ['get', 'arr']])).to.throw();
  });
  it('should return the first valid object', () => {
    expect(
      evaluate(prop, [
        'object',
        ['get', 'str'],
        ['get', 'arr'],
        ['get', 'obj'],
      ]),
    ).to.deep.equal({ key: 'value' });
  });

  // Testing for 'string'
  it('should return string if arg is string', () => {
    expect(evaluate(prop, ['string', ['get', 'str']])).to.equal('Hello World');
  });
  it('should fail if arg is not a string', () => {
    expect(() => evaluate(prop, ['string', ['get', 'num']])).to.throw();
  });
  it('should return the first valid string', () => {
    expect(
      evaluate(prop, [
        'string',
        ['get', 'num'],
        ['get', 'arr'],
        ['get', 'str'],
      ]),
    ).to.equal('Hello World');
  });

  // Testing for 'to-boolean'
  it('should convert arg to boolean', () => {
    expect(evaluate(prop, ['to-boolean', ['get', 'str']])).to.equal(true);
    expect(evaluate(prop, ['to-boolean', ['get', 'undefinedVal']])).to.equal(
      false,
    );
  });

  // Testing for 'to-number'
  it('should convert arg to number', () => {
    expect(evaluate(prop, ['to-number', ['get', 'str']])).to.be.NaN;
    expect(evaluate(prop, ['to-number', ['get', 'bool']])).to.equal(1);
  });

  // Testing for 'to-string'
  it('should convert arg to string', () => {
    expect(evaluate(prop, ['to-string', ['get', 'num']])).to.equal('123');
    expect(evaluate(prop, ['to-string', ['get', 'bool']])).to.equal('true');
  });

  // Testing for 'typeof'
  it('should return type of arg', () => {
    expect(evaluate(prop, ['typeof', ['get', 'num']])).to.equal('number');
    expect(evaluate(prop, ['typeof', ['get', 'bool']])).to.equal('boolean');
    expect(evaluate(prop, ['typeof', ['get', 'arr']])).to.equal('object');
    expect(evaluate(prop, ['typeof', ['get', 'str']])).to.equal('string');
    expect(evaluate(prop, ['typeof', ['get', 'nullVal']])).to.equal('object');
    expect(evaluate(prop, ['typeof', ['get', 'undefinedVal']])).to.equal(
      'undefined',
    );
  });
});
