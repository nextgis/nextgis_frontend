import { expect } from 'chai';
import { propertiesFilter as pf } from '../../packages/properties-filter/src';

type OBJ = Record<string, any>;

const prop = {
  zero: 0,
  two: 2,
  str: 'Foo Bar',
  true: true,
  false: false,
  text: 'JavaScript - язык программирования типа C++, основан на св ст. UNIX и отличается от языка C при программировании в С++ из-за большого числа потоков кода и большого количества операций.',
};

const props = [
  { a: 10, b: true },
  { a: 100, b: true },
  { a: 15, b: false },
  { a: -2, b: true },
  { a: 3, b: false },
];

describe(`PropertiesFilter`, () => {
  it(`eq`, () => {
    expect(pf(prop, [['zero', 'eq', 0]])).to.be.true;
    expect(pf<OBJ>(prop, [['notexist', 'eq', 'any']])).to.be.false;

    expect(pf(prop, [['two', 'eq', 2]])).to.be.true;
    expect(pf(prop, [['str', 'eq', 'Foo Bar']])).to.be.true;

    expect(pf(prop, [['true', 'eq', true]])).to.be.true;
    expect(pf(prop, [['false', 'eq', false]])).to.be.true;

    expect(pf(prop, [['two', 'eq', 3]])).to.be.false;
    expect(pf(prop, [['str', 'eq', 'str']])).to.be.false;
    expect(pf(prop, [['str', 'eq', 'String']])).to.be.false;
    expect(pf(prop, [['true', 'eq', false]])).to.be.false;
    expect(pf(prop, [['false', 'eq', true]])).to.be.false;
  });

  it(`ne`, () => {
    expect(pf(prop, [['zero', 'ne', 0]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'ne', 'any']])).to.be.true;

    expect(pf(prop, [['two', 'ne', 2]])).to.be.false;
    expect(pf(prop, [['str', 'ne', 'Foo Bar']])).to.be.false;
    expect(pf(prop, [['true', 'ne', true]])).to.be.false;
    expect(pf(prop, [['false', 'ne', false]])).to.be.false;

    expect(pf(prop, [['two', 'ne', 3]])).to.be.true;
    expect(pf(prop, [['str', 'ne', 'String']])).to.be.true;
    expect(pf(prop, [['str', 'ne', 'str']])).to.be.true;
    expect(pf(prop, [['true', 'ne', false]])).to.be.true;
    expect(pf(prop, [['false', 'ne', true]])).to.be.true;
  });

  it(`gt`, () => {
    expect(pf(prop, [['zero', 'gt', -1]])).to.be.true;
    expect(pf(prop, [['zero', 'gt', 1]])).to.be.false;
    expect(pf(prop, [['zero', 'gt', 0]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'gt', 1]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'gt', 0]])).to.be.false;

    expect(pf(prop, [['two', 'gt', 1]])).to.be.true;
    expect(pf(prop, [['two', 'gt', 300]])).to.be.false;
  });

  it(`ge`, () => {
    expect(pf(prop, [['zero', 'ge', -1]])).to.be.true;
    expect(pf(prop, [['zero', 'ge', 1]])).to.be.false;
    expect(pf(prop, [['zero', 'ge', 0]])).to.be.true;
    expect(pf<OBJ>(prop, [['notexist', 'ge', 1]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'ge', 0]])).to.be.false;

    expect(pf(prop, [['two', 'ge', 1]])).to.be.true;
    expect(pf(prop, [['two', 'ge', 2]])).to.be.true;
    expect(pf(prop, [['two', 'ge', 300]])).to.be.false;
  });

  it(`lt`, () => {
    expect(pf(prop, [['zero', 'lt', -1]])).to.be.false;
    expect(pf(prop, [['zero', 'lt', 1]])).to.be.true;
    expect(pf(prop, [['zero', 'lt', 0]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'lt', 1]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'lt', 0]])).to.be.false;

    expect(pf(prop, [['two', 'lt', 1]])).to.be.false;
    expect(pf(prop, [['two', 'lt', 2]])).to.be.false;
    expect(pf(prop, [['two', 'lt', 300]])).to.be.true;
  });

  it(`le`, () => {
    expect(pf(prop, [['zero', 'le', -1]])).to.be.false;
    expect(pf(prop, [['zero', 'le', 1]])).to.be.true;
    expect(pf(prop, [['zero', 'le', 0]])).to.be.true;
    expect(pf<OBJ>(prop, [['notexist', 'le', 1]])).to.be.false;
    expect(pf<OBJ>(prop, [['notexist', 'le', 0]])).to.be.false;

    expect(pf(prop, [['two', 'le', 1]])).to.be.false;
    expect(pf(prop, [['two', 'le', 2]])).to.be.true;
    expect(pf(prop, [['two', 'le', 300]])).to.be.true;
  });

  it(`in`, () => {
    expect(pf(prop, [['two', 'in', [1, 2, 3]]])).to.be.true;
    expect(pf(prop, [['two', 'in', [1, 3]]])).to.be.false;

    expect(pf(prop, [['zero', 'in', [1, 2, 0]]])).to.be.true;
    expect(pf(prop, [['zero', 'in', [1, 3]]])).to.be.false;

    expect(pf(prop, [['str', 'in', ['a', 'b', 'Foo Bar']]])).to.be.true;
    expect(pf(prop, [['zero', 'in', ['a', 'b', 'String']]])).to.be.false;
    expect(pf(prop, [['zero', 'in', ['a', 'b', 'str']]])).to.be.false;
  });

  it(`notin`, () => {
    expect(pf(prop, [['two', 'notin', [1, 2, 3]]])).to.be.false;
    expect(pf(prop, [['two', 'notin', [1, 3]]])).to.be.true;

    expect(pf(prop, [['zero', 'notin', [1, 2, 0]]])).to.be.false;
    expect(pf(prop, [['zero', 'notin', [1, 3]]])).to.be.true;

    expect(pf(prop, [['str', 'notin', ['a', 'b', 'Foo Bar']]])).to.be.false;
    expect(pf(prop, [['zero', 'notin', ['a', 'b', 'String']]])).to.be.true;
    expect(pf(prop, [['zero', 'notin', ['a', 'b', 'str']]])).to.be.true;
  });

  it(`like`, () => {
    const keys: [string, string[], string[]][] = [
      ['text%', ['JavaScript'], ['JAVASCRIPT', 'javascript']],
      ['%text', ['операций.'], ['ОПЕРАЦИЙ.']],
      ['%text%', ['C++', 'UNIX'], ['unix']],
    ];

    const toBeTrue: boolean[] = [];
    const toBeFalse: boolean[] = [];
    keys.forEach((x) => {
      x[1].forEach((y) => toBeTrue.push(pf<OBJ>(prop, [[x[0], 'like', y]])));
      x[2].forEach((y) => toBeFalse.push(pf<OBJ>(prop, [[x[0], 'like', y]])));
    });
    expect(toBeTrue.every((x) => x === true)).to.be.true;
    expect(toBeFalse.every((x) => x === false)).to.be.true;
  });

  it(`ilike`, () => {
    const keys: [string, string[], string[]][] = [
      ['text%', ['JAVASCRIPT', 'javascript'], []],
      ['%text', ['операций.', 'ОПЕРАЦИЙ.'], []],
      ['%text%', ['C++', 'unix'], []],
    ];

    const toBeTrue: boolean[] = [];
    const toBeFalse: boolean[] = [];
    keys.forEach((x) => {
      x[1].forEach((y) => toBeTrue.push(pf<OBJ>(prop, [[x[0], 'ilike', y]])));
      x[2].forEach((y) => toBeFalse.push(pf<OBJ>(prop, [[x[0], 'ilike', y]])));
    });
    expect(toBeTrue.every((x) => x === true)).to.be.true;
    expect(toBeFalse.every((x) => x === false)).to.be.true;
  });

  it(`all`, () => {
    expect(
      pf(prop, [
        ['str', 'eq', 'Foo Bar'],
        ['two', 'in', [1, 2, 3]],
      ]),
    ).to.be.true;
    expect(
      pf(prop, [
        ['str', 'eq', 'str'],
        ['two', 'in', [1, 2, 3]],
      ]),
    ).to.be.false;
    expect(
      pf(prop, [
        ['str', 'eq', 'Foo Bar'],
        ['text%', 'like', 'JavaScript'],
        ['two', 'in', [1, 2, 3]],
      ]),
    ).to.be.true;
    expect(pf(prop, ['all', ['str', 'eq', 'Foo Bar'], ['two', 'eq', 2]])).to.be
      .true;
  });

  it(`any`, () => {
    expect(pf(prop, ['any', ['two', 'eq', 2]])).to.be.true;
    expect(pf(prop, ['any', ['two', 'eq', 2], ['two', 'ne', 2]])).to.be.true;
    expect(pf(prop, ['any', ['str', 'eq', 's'], ['two', 'eq', 3]])).to.be.false;
    expect(pf(prop, ['any', ['str', 'eq', 's'], ['two', 'eq', 3]])).to.be.false;
    expect(
      pf(prop, [
        'any',
        ['str', 'eq', 'str'],
        ['str%', 'like', 'string'],
        ['two', 'in', [1, 2, 3]],
      ]),
    ).to.be.true;
  });

  it(`nesting`, () => {
    const filtered = props.filter((p) =>
      pf(p, [
        'any',
        [
          ['b', 'eq', true],
          ['a', 'le', 10],
        ],
        ['b', 'eq', false],
      ]),
    );
    const filtered2 = props.filter((p) =>
      pf(p, [
        'any',
        ['all', ['b', 'eq', true], ['any', ['a', 'eq', 10], ['a', 'eq', -2]]],
        ['b', 'eq', false],
      ]),
    );
    expect(filtered.length).to.be.eq(4);
    expect(filtered2.length).to.be.eq(4);
  });

  it(`in null`, () => {
    const propsWithNull = {
      a: null,
      b: 'b',
    };
    expect(
      pf(propsWithNull, [
        ['a', 'in', ['1', null]],
        ['b', 'in', ['b', 'a']],
      ]),
    ).to.be.true;
  });
});
