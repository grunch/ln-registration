const {test} = require('@alexbosworth/tap');

const {featureFlagsFromWords} = require('./../');

const tests = [
  {
    args: {},
    description: 'An array of word numbers is required',
    error: 'ExpectedArrayOfWordNumbersToDeriveFeatureFlags',
  },
  {
    args: {words: [16, 0]},
    description: 'Feature flags are returned',
    expected: {features: [{bit: 9, is_required: false, type: 'tlv_onion'}]},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    if (!!error) {
      throws(() => featureFlagsFromWords(args), new Error(error), 'Got error');
    } else {
      const res = featureFlagsFromWords(args);

      strictSame(res.features, expected.features, 'Got expected feature bits');
    }

    return end();
  });
});
