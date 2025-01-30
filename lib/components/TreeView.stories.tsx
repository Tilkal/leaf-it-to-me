import type { Meta, StoryObj } from '@storybook/react'

import { LeafMode } from '../defs'
import { TreeView } from './TreeView'

import '../root.css'

const meta: Meta<typeof TreeView> = {
  title: 'TreeView',
  component: TreeView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TreeView>

export const Default: Story = {
  args: {
    mode: LeafMode.ROOT,
    node: {
      type: 'object',
      children: [
        {
          type: 'string',
          name: 'key1',
          value: 'value1',
        },
        {
          type: 'array',
          name: 'key2',
          children: [
            {
              type: 'string',
              value: 'value2',
            },
            {
              type: 'number',
              value: 42,
            },
            {
              type: 'object',
              children: [
                {
                  type: 'number',
                  name: 'key3',
                  value: 42,
                },
                {
                  type: 'boolean',
                  name: 'key4',
                  value: true,
                },
                {
                  type: 'null',
                  name: 'key5',
                  value: null,
                },
              ],
            },
          ],
        },
        {
          type: 'string',
          name: 'key6',
          value: 'value3',
        },
      ],
    },
  },
  render: (props) => (
    <div
      style={{
        height: '100%',
        width: '700px',
        backgroundColor: '#f6f6f6',
        padding: '20px',
      }}
    >
      <TreeView {...props} />
    </div>
  ),
}
