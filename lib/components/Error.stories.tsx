import type { Meta, StoryObj } from '@storybook/react'

import { Error } from './Error'

import '../root.css'

const meta: Meta<typeof Error> = {
  title: 'Error',
  component: Error,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Error>

export const Default: Story = {
  args: {
    type: 'string',
    name: 'example',
    value: 'value',
  },
}
