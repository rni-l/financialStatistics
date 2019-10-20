const { strictEqual } = require('assert')
const { formatNumber } = require('../../../app/utils/index')

describe('test/app/utils/index.test.js', () => {
  describe('formatNumber', () => {
    const list = [
      {
        input: 12,
        output: 12
      },
      {
        input: -12,
        output: -12
      },
      {
        input: 0,
        output: 0
      },
      {
        input: 12.233,
        output: 12.23
      },
      {
        input: 12.244,
        output: 12.24
      },
      {
        input: 12.245,
        output: 12.25
      },
      {
        input: 12.246,
        output: 12.25
      }
      // {
      //   input: -12.234,
      //   output: -12.23
      // },
      // {
      //   input: -12.235,
      //   output: -12.24
      // }
    ]
    list.forEach(({ input, output }) => {
      it(`输入 ${input}，输出：${output}`, () => {
        strictEqual(formatNumber(input), output)
      })
    })
  })
})
