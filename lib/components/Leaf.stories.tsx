import type { Meta, StoryObj } from '@storybook/react'

import { LeafMode } from '../defs'
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
    type: 'string',
    name: 'example',
    value: 'value',
  },
}

export const StringLeaf: Story = {
  args: {
    type: 'string',
    name: 'lorem',
    value: 'ipsum',
  },
}

export const ArrayLeaf: Story = {
  args: {
    type: 'string',
    value: 'ipsum',
    mode: LeafMode.ARRAY,
  },
}

export const Readonly: Story = {
  args: {
    type: 'string',
    name: 'lorem',
    value: 'ipsum',
    readonly: true,
  },
}
