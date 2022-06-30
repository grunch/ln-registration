const {test} = require('@alexbosworth/tap');

const {featureFlagsAsWords} = require('./../');

const tests = [
  {
    args: {},
    description: 'An array of features is required',
    error: 'ExpectedArrayOfFeatureBitsToEncodeAsWords',
  },
  {
    args: {features: []},
    description: 'Nil features is serialized',
    expected: {words: []},
  },
  {
    args: {features: [0]},
    description: 'A feature flag is encoded',
    expected: {words: [1]},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    if (!!error) {
      throws(() => featureFlagsAsWords(args), new Error(error), 'Got error');
    } else {
      const res = featureFlagsAsWords(args);

      strictSame(res.words, expected.words, 'Got expected words encoding');
    }

    return end();
  });
});
