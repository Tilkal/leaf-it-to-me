import type { Meta, StoryObj } from '@storybook/react'

import { Leaf } from '.'
import { LeafMode } from '../../defs'

import '../../root.css'

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
    node: {
      type: 'string',
      name: 'example',
      value: 'value',
      path: '',
    },
  },
}

export const StringLeaf: Story = {
  args: {
    node: {
      type: 'string',
      name: 'lorem',
      value: 'ipsum',
      path: '',
    },
  },
}

export const NumberLeaf: Story = {
  args: {
    node: {
      type: 'number',
      name: 'lorem',
      value: 42,
      path: '',
    },
  },
}

export const BooleanLeaf: Story = {
  args: {
    node: {
      type: 'boolean',
      name: 'lorem',
      value: true,
      path: '',
    },
  },
}

export const ArrayLeaf: Story = {
  args: {
    node: {
      type: 'array',
      name: 'lorem',
      value: 'ipsum',
      path: '',
    },
  },
}

export const ObjectLeaf: Story = {
  args: {
    node: {
      type: 'object',
      name: 'lorem',
      value: 'ipsum',
      path: '',
    },
  },
}

export const ArrayElementLeaf: Story = {
  args: {
    node: {
      type: 'string',
      value: 'ipsum',
      path: '',
    },
    mode: LeafMode.ARRAY,
  },
}

export const Readonly: Story = {
  args: {
    node: {
      type: 'string',
      name: 'lorem',
      value: 'ipsum',
      path: '',
    },
    readonly: true,
  },
}

export const EditingLeaf: Story = {
  args: {
    node: {
      type: 'string',
      name: 'lorem',
      value: 'ipsum',
      path: '',
    },
    edit: true,
  },
}
