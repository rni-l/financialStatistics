module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    // Place your rules here
    'type-enum': [0] // error if scope is given but not in provided list
  }
}
