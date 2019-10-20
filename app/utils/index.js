module.exports = {
  /**
   * 验证值是否 null undefined ''
   * @param {any} val
   * @returns {boolean}
   */
  isDef: val => {
    return !val && val !== 0 && val !== false
  },

  checkIsNumber: val => typeof val === 'number',

  // formatNumber: val => parseFloat(
  //   (
  //     Math.round((Math.round(val * 1000) / 1000) * 100) /
  //     100
  //   )
  //     .toFixed(2),
  //   10
  // )

  // formatNumber: val => parseFloat((Math.floor(val * 1000) / 1000).toFixed(2), 10)
  formatNumber: val => parseFloat(Math.round(+parseFloat(val.toPrecision(12)) * 100) / 100, 10)
}
