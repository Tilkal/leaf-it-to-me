import type { Meta, StoryObj } from '@storybook/react'

import { LeafItToMe } from './LeafItToMe'
import config from './config.json'

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
    onChange: (json) => console.log({ json }),
  },
}

export const LargeJSON: Story = {
  args: {
    json: config.themes,
  },
}
