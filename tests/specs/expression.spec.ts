import { expect } from 'chai';
import { evaluate, isExpression } from '../../packages/expression/src';

describe('Lookup Expressions', () => {
  describe('Get', () => {
    const prop = {
      foo: 'bar',
      key: 'foo',
      nested: { key: 'value' },
    };

    it('should get value from data using key', () => {
      expect(evaluate(['get', 'foo'], prop)).to.equal('bar');
      expect(evaluate(['get', 'nested'], prop)).to.eql({ key: 'value' });
    });

    it('should get value from evaluated object using key', () => {
      expect(evaluate(['get', 'key', ['get', 'nested']], prop)).to.equal(
        'value',
      );
    });

    it('should return undefined for nonexistent keys', () => {
      expect(evaluate(['get', 'nonexistent'], prop)).to.be.null;
    });
  });

  describe('Has', () => {
    const prop = {
      foo: 'bar',
      key: 'foo',
      nested: { key: 'value' },
    };

    it('should test an item in data using key', () => {
      expect(evaluate(['has', 'foo'], prop)).to.be.true;
    });

    it('should test an item in evaluated object using key', () => {
      expect(evaluate(['has', 'key', ['get', 'nested']], prop)).to.be.true;
    });

    it('should return false for nonexistent keys', () => {
      expect(evaluate(['has', 'nonexistent'], prop)).to.be.false;
    });
  });

  describe('Index-of', () => {
    const prop = {
      arr: ['one', 'two', 'three'],
      str: 'hello world',
      one: 'one',
      hello: 'hello',
      startIndex: 5,
    };

    // Testing for 'index-of' with array
    it('should find the index of an item in the array', () => {
      expect(evaluate(['index-of', 'one', ['get', 'arr']], prop)).to.equal(0);
      expect(evaluate(['index-of', 'two', ['get', 'arr']], prop)).to.equal(1);
      expect(evaluate(['index-of', 'four', ['get', 'arr']], prop)).to.equal(-1);
    });

    // Testing for 'index-of' with string
    it('should find the start index of a substring in the string', () => {
      expect(evaluate(['index-of', 'hello', ['get', 'str']], prop)).to.equal(0);
      expect(evaluate(['index-of', 'world', ['get', 'str']], prop)).to.equal(6);
      expect(evaluate(['index-of', 'Bye', ['get', 'str']], prop)).to.equal(-1);
    });

    // Testing for 'index-of' with starting index
    it('should find the start index of a substring in the string starting from a given index', () => {
      expect(
        evaluate(
          ['index-of', 'o', ['get', 'str'], ['get', 'startIndex']],
          prop,
        ),
      ).to.equal(7);
    });
  });

  const prop = {
    str: 'Hello World',
    arr: [1, 2, 3, 4, 5],
    obj: { key: 'value' },
    hello: 'Hello',
    two: 2,
  };

  // Testing for 'at'
  it('should return item at specific index from array or string', () => {
    expect(evaluate(['at', 1, ['get', 'arr']], prop)).to.equal(2);
    expect(evaluate(['at', 4, ['get', 'str']], prop)).to.equal('o');
  });

  // Testing for 'length'
  it('should return length of array or string', () => {
    expect(evaluate(['length', ['get', 'arr']], prop)).to.equal(5);
    expect(evaluate(['length', ['get', 'str']], prop)).to.equal(11);
  });

  // Testing for 'in'
  it('should test presence in array', () => {
    expect(evaluate(['in', ['get', 'two'], ['get', 'arr']], prop)).to.be.true;
    expect(evaluate(['in', 6, ['get', 'arr']], prop)).to.be.false;
  });

  it('should test presence in string', () => {
    expect(evaluate(['in', ['get', 'hello'], ['get', 'str']], prop)).to.be.true;
    expect(evaluate(['in', 'Bye', ['get', 'str']], prop)).to.be.false;
  });

  // Testing for 'slice'
  it('should slice array', () => {
    expect(evaluate(['slice', ['get', 'arr'], 1, 4], prop)).to.deep.equal([
      2, 3, 4,
    ]);
  });

  it('should slice string', () => {
    expect(evaluate(['slice', ['get', 'str'], 0, 5], prop)).to.equal('Hello');
  });
});

describe(`Decision Expression`, () => {
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

  describe('caseFunc', () => {
    it('returns the correct branch based on the condition', () => {
      expect(
        evaluate(
          [
            'case',
            ['==', ['get', 'two'], 2],
            'matches two',
            ['==', ['get', 'str'], 'Not Foo Bar'],
            'matches string',
            'fallback',
          ],
          prop,
        ),
      ).to.be.equal('matches two');

      expect(
        evaluate(
          [
            'case',
            ['==', ['get', 'two'], 3],
            'matches two',
            ['==', ['get', 'str'], 'Foo Bar'],
            'matches string',
            'fallback',
          ],
          prop,
        ),
      ).to.be.equal('matches string');

      expect(
        evaluate(
          [
            'case',
            ['==', ['get', 'two'], 3],
            'matches two',
            ['==', ['get', 'str'], 'Not Foo Bar'],
            'matches string',
            'fallback',
          ],
          prop,
        ),
      ).to.be.equal('fallback');
    });

    it('throws an error if no fallback is provided', () => {
      expect(() =>
        evaluate(['case', ['==', ['get', 'two'], 2], 'matches two'], prop),
      ).to.throw;
    });

    it('works with multiple condition-output pairs', () => {
      expect(
        evaluate(
          [
            'case',
            ['==', ['get', 'two'], 3],
            'matches two',
            ['==', ['get', 'str'], 'Not Foo Bar'],
            'matches string',
            ['==', ['get', 'zero'], 0],
            'matches zero',
            'fallback',
          ],
          prop,
        ),
      ).to.be.equal('matches zero');
    });
  });

  it('match', () => {
    expect(
      evaluate(['match', ['get', 'two'], 2, 'matched', 'not matched'], prop),
    ).to.be.equal('matched');
    expect(
      evaluate(
        ['match', ['get', 'str'], 'Foo', 'matched', 'not matched'],
        prop,
      ),
    ).to.be.equal('not matched');
  });

  it('not', () => {
    expect(evaluate(['!', ['get', 'true']], prop)).to.be.false;
    expect(evaluate(['!', ['get', 'false']], prop)).to.be.true;
  });

  describe('notEqual', () => {
    it('should return true when two numbers are not equal', () => {
      expect(evaluate(['!=', ['get', 'two'], 3], prop)).to.be.true;
    });

    it('should return false when two numbers are equal', () => {
      expect(evaluate(['!=', ['get', 'two'], 2], prop)).to.be.false;
    });

    it('should throw for different data types', () => {
      expect(() => evaluate(['!=', ['get', 'str'], 2], prop)).to.be.throw;
    });

    it('should throw when comparing null and undefined', () => {
      expect(() =>
        evaluate(['!=', ['get', 'nullValue'], ['get', 'undefinedValue']], prop),
      ).to.be.throw;
    });

    it('should throw when comparing true and false', () => {
      expect(() => evaluate(['!=', ['get', 'true'], ['get', 'false']], prop)).to
        .be.throw;
    });
  });

  // Test for relational operators
  it('relational', () => {
    expect(evaluate(['==', ['get', 'two'], 2], prop)).to.be.true;
    expect(evaluate(['<', ['get', 'two'], 3], prop)).to.be.true;
    expect(evaluate(['<=', ['get', 'two'], 2], prop)).to.be.true;
    expect(evaluate(['>', ['get', 'two'], 1], prop)).to.be.true;
    expect(evaluate(['>=', ['get', 'two'], 2], prop)).to.be.true;
  });

  it('all and any', () => {
    expect(evaluate(['all', ['get', 'true'], ['==', ['get', 'two'], 2]], prop))
      .to.be.true;
    expect(evaluate(['any', ['get', 'false'], ['==', ['get', 'two'], 2]], prop))
      .to.be.true;
  });

  it('isExpression', () => {
    expect(isExpression(['get', 'two'])).to.be.true;
    expect(isExpression(['get'])).to.be.false;
    expect(isExpression(['unknown', 'two'])).to.be.false;
  });
});

describe(`Interpolate Expression`, () => {
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
    value: 5,
    colorValue: '#ff0000',
  };

  it('step with stops', () => {
    expect(
      evaluate(
        ['step', ['get', 'value'], 0, 4, 'low', 6, 'medium', 8, 'high'],
        prop,
      ),
    ).to.equal('low');
    expect(
      evaluate(
        ['step', ['get', 'value'], 0, 4, 'low', 6, 'medium', 8, 'high'],
        prop,
      ),
    ).to.equal('low');
    expect(
      evaluate(['step', 6, 0, 4, 'low', 6, 'medium', 8, 'high'], prop),
    ).to.equal('medium');
    expect(
      evaluate(['step', 9, 0, 4, 'low', 6, 'medium', 8, 'high'], prop),
    ).to.equal('high');
    expect(evaluate(['step', 1, 'low', 6, 'medium', 8, 'high'], prop)).to.equal(
      'low',
    );
  });

  describe('Linear interpolate', () => {
    const prop = {
      value: 5,
      gradientValue: 0.5,
    };

    it('interpolate numbers', () => {
      expect(
        evaluate(
          ['interpolate', ['linear'], ['get', 'value'], 0, 10, 10, 20],
          prop,
        ),
      ).to.equal(15);
    });

    it('interpolate from HEX colors', () => {
      expect(
        evaluate(
          [
            'interpolate',
            ['linear'],
            ['get', 'gradientValue'],
            0,
            '#000000',
            1,
            '#ffffff',
          ],
          prop,
        ),
      ).to.equal('rgb(128,128,128)');
    });

    it('interpolate from RGB colors', () => {
      expect(
        evaluate(
          [
            'interpolate',
            ['linear'],
            ['get', 'gradientValue'],
            0,
            'rgb(0,0,0)',
            1,
            'rgb(255,255,255)',
          ],
          prop,
        ),
      ).to.equal('rgb(128,128,128)');
    });

    it('interpolate from Named colors', () => {
      expect(
        evaluate(
          [
            'interpolate',
            ['linear'],
            ['get', 'gradientValue'],
            0,
            'black',
            1,
            'white',
          ],
          prop,
        ),
      ).to.equal('rgb(128,128,128)');
    });

    it('interpolate with multiple stops (numbers)', () => {
      expect(
        evaluate(
          ['interpolate', ['linear'], 14, 0, 10, 5, 20, 10, 30, 15, 40],
          prop,
        ),
      ).to.equal(38);
    });
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
    expect(evaluate(['+', ['get', 'a'], ['get', 'b'], 1], prop)).to.equal(6);
  });

  it('subtracts numbers', () => {
    expect(evaluate(['-', ['get', 'h'], ['get', 'a']], prop)).to.equal(6);
  });

  it('multiplies numbers', () => {
    expect(evaluate(['*', ['get', 'a'], ['get', 'b']], prop)).to.equal(6);
  });

  it('divides numbers', () => {
    expect(evaluate(['/', ['get', 'h'], ['get', 'a']], prop)).to.equal(4);
  });

  it('calculates modulo', () => {
    expect(evaluate(['%', ['get', 'h'], ['get', 'b']], prop)).to.equal(2);
  });

  it('calculates power', () => {
    expect(evaluate(['^', ['get', 'a'], ['get', 'b']], prop)).to.equal(8);
  });

  it('calculates absolute', () => {
    expect(evaluate(['abs', ['get', 'c']], prop)).to.equal(5);
  });

  it('calculates acos', () => {
    expect(evaluate(['acos', ['get', 'f']], prop)).to.equal(0);
  });

  it('calculates asin', () => {
    expect(evaluate(['asin', ['get', 'g']], prop)).to.equal(0);
  });

  it('calculates atan', () => {
    expect(evaluate(['atan', ['get', 'f']], prop)).to.be.closeTo(
      Math.PI / 4,
      0.0001,
    );
  });

  it('calculates ceil', () => {
    expect(evaluate(['ceil', ['get', 'd']], prop)).to.equal(3);
  });

  it('calculates cosine', () => {
    expect(evaluate(['cos', Math.PI], prop)).to.equal(-1);
  });

  it('returns Euler number', () => {
    expect(evaluate(['e'], prop)).to.equal(Math.E);
  });

  it('calculates floor', () => {
    expect(evaluate(['floor', ['get', 'e']], prop)).to.equal(2);
  });
});

describe('Type Expressions', () => {
  describe('Array', () => {
    const prop = {
      stringArray: ['a', 'b', 'c'],
      mixedArray: [1, 'a', true],
      numberArray: [1, 2, 3, 4],
      booleanArray: [true, false, true],
    };

    it('should check if a value is an array', () => {
      expect(evaluate(['array', ['get', 'stringArray']], prop)).to.eql([
        'a',
        'b',
        'c',
      ]);
      // Is it normal to use mixed array?
      // expect(evaluate(data, ['array', ['get', 'mixedArray']], prop)).to.throw(Error);
    });

    it('should check if all items of an array are of a specific type', () => {
      expect(
        evaluate(['array', 'string', ['get', 'stringArray']], prop),
      ).to.eql(['a', 'b', 'c']);

      expect(() =>
        evaluate(['array', 'number', ['get', 'stringArray']], prop),
      ).to.throw(Error);

      expect(() =>
        evaluate(['array', 'boolean', ['get', 'mixedArray']], prop),
      ).to.throw(Error);
    });

    it('should check the length of the array if specified', () => {
      expect(
        evaluate(['array', 'number', 4, ['get', 'numberArray']], prop),
      ).to.eql([1, 2, 3, 4]);
      expect(() =>
        evaluate(['array', 'number', 3, ['get', 'numberArray']], prop),
      ).to.throw(Error);
    });

    it('should check both type and length if specified', () => {
      expect(
        evaluate(['array', 'boolean', 3, ['get', 'booleanArray']], prop),
      ).to.eql([true, false, true]);
      expect(() =>
        evaluate(['array', 'boolean', 2, ['get', 'booleanArray']], prop),
      ).to.throw(Error);
      expect(() =>
        evaluate(['array', 'string', 3, ['get', 'booleanArray']], prop),
      ).to.throw(Error);
    });
  });

  const prop = {
    num: 123,
    str: 'Hello World',
    arr: [1, 2, 3],
    bool: true,
    obj: { key: 'value' },
    nullVal: null,
    undefinedVal: undefined,
  };

  // Testing for 'boolean'
  it('should return boolean if arg is boolean', () => {
    expect(evaluate(['boolean', ['get', 'bool']], prop)).to.equal(true);
  });
  it('should fail if arg is not a boolean', () => {
    expect(() => evaluate(['boolean', ['get', 'str']], prop)).to.throw();
  });
  it('should return the first valid boolean', () => {
    expect(
      evaluate(
        ['boolean', ['get', 'num'], ['get', 'str'], ['get', 'bool']],
        prop,
      ),
    ).to.equal(true);
  });

  // Testing for 'literal'
  it('should return arg as it is', () => {
    expect(evaluate(['literal', ['get', 'str']], prop)).to.equal('Hello World');
  });

  // Testing for 'number'
  it('should return number if arg is number', () => {
    expect(evaluate(['number', ['get', 'num']], prop)).to.equal(123);
  });
  it('should fail if arg is not a number', () => {
    expect(() => evaluate(['number', ['get', 'str']], prop)).to.throw();
  });
  it('should return the first valid number', () => {
    expect(
      evaluate(
        ['number', ['get', 'str'], ['get', 'arr'], ['get', 'num']],
        prop,
      ),
    ).to.equal(123);
  });

  // Testing for 'object'
  it('should return object if arg is object', () => {
    expect(evaluate(['object', ['get', 'obj']], prop)).to.deep.equal({
      key: 'value',
    });
  });
  it('should fail if arg is not an object', () => {
    expect(() => evaluate(['object', ['get', 'arr']], prop)).to.throw();
  });
  it('should return the first valid object', () => {
    expect(
      evaluate(
        ['object', ['get', 'str'], ['get', 'arr'], ['get', 'obj']],
        prop,
      ),
    ).to.deep.equal({ key: 'value' });
  });

  // Testing for 'string'
  it('should return string if arg is string', () => {
    expect(evaluate(['string', ['get', 'str']], prop)).to.equal('Hello World');
  });
  it('should fail if arg is not a string', () => {
    expect(() => evaluate(['string', ['get', 'num']], prop)).to.throw();
  });
  it('should return the first valid string', () => {
    expect(
      evaluate(
        ['string', ['get', 'num'], ['get', 'arr'], ['get', 'str']],
        prop,
      ),
    ).to.equal('Hello World');
  });

  // Testing for 'to-boolean'
  it('should convert arg to boolean', () => {
    expect(evaluate(['to-boolean', ['get', 'str']], prop)).to.equal(true);
    expect(evaluate(['to-boolean', ['get', 'undefinedVal']], prop)).to.equal(
      false,
    );
  });

  // Testing for 'to-number'
  it('should convert arg to number', () => {
    expect(evaluate(['to-number', ['get', 'str']], prop)).to.be.NaN;
    expect(evaluate(['to-number', ['get', 'bool']], prop)).to.equal(1);
  });

  // Testing for 'to-string'
  it('should convert arg to string', () => {
    expect(evaluate(['to-string', ['get', 'num']], prop)).to.equal('123');
    expect(evaluate(['to-string', ['get', 'bool']], prop)).to.equal('true');
  });

  // Testing for 'typeof'
  it('should return type of arg', () => {
    expect(evaluate(['typeof', ['get', 'num']], prop)).to.equal('number');
    expect(evaluate(['typeof', ['get', 'bool']], prop)).to.equal('boolean');
    expect(evaluate(['typeof', ['get', 'arr']], prop)).to.equal('object');
    expect(evaluate(['typeof', ['get', 'str']], prop)).to.equal('string');
    expect(evaluate(['typeof', ['get', 'nullVal']], prop)).to.equal('object');
    expect(evaluate(['typeof', ['get', 'undefinedVal']], prop)).to.equal(
      'undefined',
    );
  });
});

describe('String Expressions', () => {
  const prop = {
    str: 'Hello World',
    subStr1: 'Hello',
    subStr2: 'World',
    num: 123,
    bool: true,
  };

  it('should concatenate strings', () => {
    expect(
      evaluate(['concat', ['get', 'subStr1'], ['get', 'subStr2']], prop),
    ).to.equal('HelloWorld');
    expect(evaluate(['concat', 'Foo', ' ', 'Bar'])).to.equal('Foo Bar');
  });

  it('should convert string to lowercase', () => {
    expect(evaluate(['downcase', ['get', 'str']], prop)).to.equal(
      'hello world',
    );
    expect(evaluate(['downcase', 'UPPERCASE'])).to.equal('uppercase');
  });

  it('should convert string to uppercase', () => {
    expect(evaluate(['upcase', ['get', 'str']], prop)).to.equal('HELLO WORLD');
    expect(evaluate(['upcase', 'lowercase'])).to.equal('LOWERCASE');
  });
});
