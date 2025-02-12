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
      '': 'value',
      someArray: [
        42,
        {
          '': '',
        },
      ],
    },
    config: {
      disableWarnings: true,
    },
  },
}
