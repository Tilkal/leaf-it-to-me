import type { Meta, StoryObj } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import { LeafItToMe, LeafItToMeProps } from './LeafItToMe'
import { JSONType } from './defs'

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
      someObject: {
        some: 'value',
      },
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
      <LeafItToMe json={json} onChange={setJson} />
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
      someArray2: [
        42,
        {
          key: 'value',
        },
      ],
      someArray3: [
        42,
        {
          key: 'value',
        },
      ],
    },
  },
  render: ({ json }) => <WithCallbackComponent json={json} />,
}

const WithAsyncComponent = () => {
  const [json, setJson] = useState<JSONType>({})

  useEffect(() => {
    setTimeout(() => {
      setJson({
        some: 'json',
      })
    }, 1000)
  }, [])

  return (
    <div>
      <pre
        style={{
          borderRadius: '4px',
          backgroundColor: '#edede9',
          padding: '10px',
        }}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
      <LeafItToMe json={json} onChange={setJson} />
    </div>
  )
}

export const AsyncJson: Story = {
  args: {},
  render: () => <WithAsyncComponent />,
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

export const Collapsed: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        'value',
        {
          key2: 'value',
          key3: 'value',
        },
      ],
      someObject: {
        key4: 'value',
      },
    },
    config: {
      collapsed: true,
    },
  },
}

export const CollapsedConfig: Story = {
  args: {
    json: {
      key: 'value',
      someArray: [
        42,
        'value',
        {
          key2: 'value',
          key3: 'value',
        },
      ],
      someObject: {
        key4: 'value',
      },
    },
    config: {
      collapsed: [/^some-array.2$/, /^some-object$/],
    },
  },
}

export const SearchAndNavigation: Story = {
  args: {
    config: {
      collapsed: [/^product.reviews$/, /^orderHistory$/, /^sampleData$/],
    },
    json: {
      product: {
        id: 123,
        name: 'Wireless Mouse',
        price: 25.99,
        inStock: true,
        tags: ['computer', 'accessory', 'ergonomic'],
        details: {
          color: 'black',
          connectivity: 'bluetooth',
          weight: '80g',
        },
        reviews: [
          { user: 'Alice', rating: 5, comment: 'Great value!' },
          { user: 'Bob', rating: 4, comment: 'Works well.' },
          {
            user: 'Charlie',
            rating: 5,
            comment: 'Ergonomic design is a plus.',
          },
          {
            user: 'David',
            rating: 3,
            comment: 'Battery life could be better.',
          },
          {
            user: 'Eve',
            rating: 4,
            comment: 'Solid performance for the price.',
          },
        ],
      },
      userSettings: {
        theme: 'dark',
        notifications: {
          email: true,
          sms: false,
        },
        language: 'en',
      },
      orderHistory: [
        { orderId: 'A1B2', date: '2023-11-01', total: 50.0 },
        { orderId: 'C3D4', date: '2023-11-05', total: 75.5 },
      ],
      configurations: {
        general: {
          autoSave: true,
          interval: 5,
        },
        advanced: {
          loggingLevel: 'info',
          maxRetries: 3,
        },
      },
      contactInfo: {
        email: 'support@example.com',
        phone: '1-800-TECH',
        address: {
          street: '123 Tech Lane',
          city: 'Silicon Valley',
          zip: '95000',
        },
      },
      sampleData: [
        'apple',
        'banana',
        'cherry',
        'date',
        'elderberry',
        'fig',
        'grape',
        'honeydew',
        'kiwi',
        'lemon',
        'mango',
        'nectarine',
        'orange',
        'papaya',
      ],
    },
  },
  render: (props) => (
    <div style={{ height: '600px' }}>
      <LeafItToMe {...props} />
    </div>
  ),
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
