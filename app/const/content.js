const CONTENT_STATUS = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '停用',
    value: 0
  }
]

module.exports = {
  CONTENT_STATUS,
  CONTENT_STATUS_ENUM: CONTENT_STATUS.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})
}
