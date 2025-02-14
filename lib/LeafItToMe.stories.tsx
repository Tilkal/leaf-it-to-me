import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { LeafItToMe, LeafItToMeProps } from './LeafItToMe'
import config from './config.json'
import { JSONType } from './defs'

const meta: Meta<typeof LeafItToMe> = {
  title: 'LeafItToMe',
  component: LeafItToMe,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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

export const LargeJSON: Story = {
  args: {
    json: config.themes,
  },
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
