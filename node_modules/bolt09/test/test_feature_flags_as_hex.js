const {test} = require('@alexbosworth/tap');

const {featureFlagsAsHex} = require('./../');

const tests = [
  {
    args: {},
    description: 'An array of features is required',
    error: 'ExpectedArrayOfFeaturesToEncodeAsHex',
  },
  {
    args: {features: []},
    description: 'Nil features is serialized',
    expected: {encoded: '0000'},
  },
  {
    args: {features: [0]},
    description: 'A feature flag is serialized',
    expected: {encoded: '000101'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, async ({deepEqual, end, equal, throws}) => {
    if (!!error) {
      throws(() => featureFlagsAsHex(args), new Error(error), 'Got error');
    } else {
      const res = featureFlagsAsHex(args);

      equal(res.encoded, expected.encoded, 'Got expected serialization');
    }

    return end();
  });
});
