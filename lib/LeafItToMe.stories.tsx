import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { LeafItToMe, LeafItToMeProps } from './LeafItToMe'
import { ErrorLevel, JSONType } from './defs'

const meta: Meta<typeof LeafItToMe> = {
  title: 'LeafItToMe',
  component: LeafItToMe,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100%',
          width: '700px',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof LeafItToMe>

export const Default: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        {
          key: 'value',
        },
      ],
    },
  },
}

const WithCallbackComponent: React.FC<LeafItToMeProps> = ({ json }) => {
  const [updatedJson, setJson] = useState<JSONType>(json)

  return (
    <div>
      <pre
        style={{
          borderRadius: '4px',
          backgroundColor: '#edede9',
          padding: '10px',
        }}
      >
        {JSON.stringify(updatedJson, null, 2)}
      </pre>
      <LeafItToMe
        json={json}
        onChange={(newJson) => {
          if (JSON.stringify(newJson) !== JSON.stringify(updatedJson)) {
            setJson(newJson)
          }
        }}
      />
    </div>
  )
}

export const WithCallback: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        {
          key: 'value',
        },
      ],
    },
  },
  render: ({ json }) => <WithCallbackComponent json={json} />,
}

export const WithError: Story = {
  args: {
    json: {
      key: 'value',
      key2: {
        key3: String.raw`value\ `,
      },
    },
  },
}

export const WarningsDisabled: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        {
          key2: '',
          '': 'value2',
        },
      ],
    },
    config: {
      disableWarnings: true,
    },
  },
}

export const FullReadonly: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        {
          key2: 'value2',
          key3: 'value3',
        },
      ],
    },
    config: {
      readonly: true,
    },
  },
}

export const PartialReadonly: Story = {
  args: {
    json: {
      key: 'readonly with regex /^key$/',
      someArray: [
        42,
        'readonly with regex /^some-array.1$/',
        {
          key2: 'readonly with regex /key[0-9]+$/',
          key3: 'readonly with regex /key[0-9]+$/',
          editable: 'not matching regex',
        },
      ],
      readonlyArray: ['readonly with regex /^readonly/', 82],
      readonlyObject: {
        key4: 'readonly with regex /^readonly/ and /key[0-9]+$/',
      },
    },
    config: {
      readonly: [/^key$/, /^some-array.1$/, /key[0-9]+$/, /^readonly/],
    },
  },
}

export const Translator: Story = {
  args: {
    json: {
      key: 'value',
    },
    config: {
      language: {
        translator: (path: string) =>
          `Custom translator function!\nHere is the original key:\n${path}`,
      },
    },
  },
}

export const Translations: Story = {
  args: {
    json: {
      key: 'value',
    },
    config: {
      language: {
        translations: {
          'tree-view': {
            action: {
              add: {
                label: 'Only one label edited',
              },
            },
          },
        },
      },
    },
  },
}

export const ExpandedConfig: Story = {
  args: {
    json: {
      key: 'readonly with regex /^key$/',
      someArray: [
        42,
        'readonly with regex /^some-array.1$/',
        {
          key2: 'readonly with regex /key[0-9]+$/',
          key3: 'readonly with regex /key[0-9]+$/',
          editable: 'not matching regex',
        },
      ],
      readonlyArray: ['readonly with regex /^readonly/', 82],
      readonlyObject: {
        key4: 'readonly with regex /^readonly/ and /key[0-9]+$/',
      },
    },
    config: {
      isExpanded: [/^some-array$/],
    },
  },
}

export const LongText: Story = {
  args: {
    json: {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      arr: [
        {
          key: 'Quisque sed elit vel felis eleifend vehicula at nec ante.',
          ['Quisque sed elit vel felis eleifend vehicula at nec ante.']:
            'value',
        },
        {
          nested: {
            very: {
              very: {
                very: {
                  very: {
                    deep: 'Phasellus ex lacus, suscipit non est ut, pulvinar accumsan nisl.',
                    ['Phasellus ex lacus, suscipit non est ut, pulvinar accumsan nisl.']:
                      'value',
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
  render: (props) => (
    <div style={{ background: '#eee', width: '500px' }}>
      <p style={{ fontFamily: 'sans-serif', padding: '10px' }}>
        Long text and deeply nested long text in small container
      </p>
      <LeafItToMe {...props} />
    </div>
  ),
}

export const CustomType: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        {
          key: 'value',
          custom: 'Hello world!',
        },
      ],
    },
    config: {
      plugins: [
        {
          type: 'helloworld',
          color: 'cyan',
          checker: (value) => value === 'Hello world!',
          validator: (value) =>
            value === 'Hello world!' ? ErrorLevel.NONE : ErrorLevel.ERROR,
          errorMessages: {
            [ErrorLevel.ERROR]: 'Should be Hello world!',
          },
          parser: (value) => value,
          nested: false,
        },
      ],
    },
  },
}
