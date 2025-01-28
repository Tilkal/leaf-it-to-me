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

export const NumberLeaf: Story = {
  args: {
    type: 'number',
    name: 'lorem',
    value: 42,
  },
}

export const BooleanLeaf: Story = {
  args: {
    type: 'boolean',
    name: 'lorem',
    value: true,
  },
}

export const ArrayLeaf: Story = {
  args: {
    type: 'array',
    name: 'lorem',
    value: 'ipsum',
  },
}

export const ObjectLeaf: Story = {
  args: {
    type: 'object',
    name: 'lorem',
    value: 'ipsum',
  },
}

export const ArrayElementLeaf: Story = {
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

export const EditingLeaf: Story = {
  args: {
    type: 'string',
    name: 'lorem',
    value: 'ipsum',
    edit: true,
  },
}
