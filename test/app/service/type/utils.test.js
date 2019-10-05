/**
 * 功能
 */
const assert = require('assert')
const { changeObjectToField } = require('../../../../app/service/type/utils.js')

describe('test/utils/filterRouter.test.js', () => {
  const list = [
    {
      objects: [
        {
          key: 'name',
          type: 'string',
          length: 32,
          isRequired: true,
          character: 'utf8mb4_unicode_ci',
          defaultValue: ''
        },
        {
          key: 'status',
          type: 'number',
          length: 1,
          isRequired: true,
          character: '',
          defaultValue: 1
        },
        {
          key: 'order',
          type: 'number',
          length: 32,
          isRequired: true,
          character: '',
          defaultValue: 0
        },
        {
          key: 'created_time',
          type: 'timestamp',
          isRequired: true,
          defaultValue: 'CURRENT_TIMESTAMP'
        },
        {
          key: 'updated_time',
          type: 'timestamp',
          isRequired: true,
          defaultValue: 'CURRENT_TIMESTAMP',
          onTimeUpdate: 'ON UPDATE CURRENT_TIMESTAMP'
        },
        {
          key: 'other',
          type: 'text',
          length: '',
          isRequired: false,
          character: '',
          defaultValue: ''
        }
      ],
      result: `(
  \`id\` int(32) unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(32) utf8mb4_unicode_ci NOT NULL,
  \`status\` int(1) NOT NULL DEFAULT '1',
  \`order\` int(32) NOT NULL DEFAULT '0',
  \`created_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`other\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
)`
    }
  ]

  list.forEach(v => {
    it(`${JSON.stringify(v.objects)} 转为：${v.result}`, () => {
      assert(changeObjectToField(v.objects).replace(/ /g, '') === v.result.replace(/ /g, ''))
    })
  })
})
