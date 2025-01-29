import type { Meta, StoryObj } from '@storybook/react'

import { TypeSelector } from './TypeSelector'

import '../root.css'

const meta: Meta<typeof TypeSelector> = {
  title: 'TypeSelector',
  component: TypeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TypeSelector>

export const Default: Story = {
  args: {
    value: 'string',
  },
}
