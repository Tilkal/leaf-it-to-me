import type { Meta, StoryObj } from '@storybook/react'

import { ConfigContextProvider } from '../../contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from '../../contexts/TreeContext/TreeContextProvider'
import { LeafMode } from '../../defs'
import { Leaf } from './index'

import '../../root.css'

const meta: Meta<typeof Leaf> = {
  title: 'Leaf',
  component: Leaf,
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
        <ConfigContextProvider>
          <TreeContextProvider tree={{ type: 'null', path: '' }}>
            <Story />
          </TreeContextProvider>
        </ConfigContextProvider>
      </div>
    ),
  ],
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
