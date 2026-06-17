// nanoid 5.x ships as ESM-only, which Jest (CommonJS) cannot require through the
// @tago-io/sdk bundle. Tests never exercise id generation, so a deterministic stub is enough.
module.exports = {
  nanoid: () => "test-nanoid-id",
  customAlphabet: () => () => "test-nanoid-id",
};
