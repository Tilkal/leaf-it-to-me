import type { Meta, StoryObj } from '@storybook/react'

import { Leaf } from './Leaf'

import '../root.css'

const meta: Meta<typeof Leaf> = {
  title: 'Leaf',
  component: Leaf,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Leaf>

export const Default: Story = {
  args: {
    name: 'example',
    value: 'value',
  },
}

export const StringLeaf: Story = {
  args: {
    name: 'lorem',
    value: 'ipsum',
  },
}
