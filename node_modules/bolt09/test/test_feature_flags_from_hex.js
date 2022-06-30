const {test} = require('@alexbosworth/tap');

const {featureFlagsFromHex} = require('./../');

const tests = [
  {
    args: {},
    description: 'Serialized feature flags are required',
    error: 'ExpectedHexSerializedFeatureFlagsToDecode',
  },
  {
    args: {hex: '00018C'},
    description: 'Feature flags are returned',
    expected: {
      features: [
        {bit: 2, is_required: true, type: undefined},
        {bit: 3, is_required: false, type: 'requires_initial_graph'},
        {bit: 7, is_required: false, type: 'gossip_queries_v1'},
      ],
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    if (!!error) {
      throws(() => featureFlagsFromHex(args), new Error(error), 'Got error');
    } else {
      const res = featureFlagsFromHex(args);

      strictSame(res.features, expected.features, 'Got expected feature flags');
    }

    return end();
  });
});
