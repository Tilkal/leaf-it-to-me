import type { Meta, StoryObj } from '@storybook/react'

import { ConfigContextProvider } from '../contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from '../contexts/TreeContext/TreeContextProvider'
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
      path: '',
      children: [
        {
          type: 'string',
          name: 'key1',
          value: 'value1',
          path: 'key1',
        },
        {
          type: 'array',
          name: 'key2',
          path: 'key2',
          children: [
            {
              type: 'string',
              value: 'value2',
              path: 'key2.0',
            },
            {
              type: 'number',
              value: 42,
              path: 'key2.1',
            },
            {
              type: 'object',
              path: 'key2.2',
              children: [
                {
                  type: 'number',
                  name: 'key3',
                  value: 42,
                  path: 'key2.2.key3',
                },
                {
                  type: 'boolean',
                  name: 'key4',
                  value: true,
                  path: 'key2.2.key4',
                },
                {
                  type: 'null',
                  name: 'key5',
                  value: null,
                  path: 'key2.2.key5',
                },
              ],
            },
          ],
        },
        {
          type: 'string',
          name: 'key6',
          value: 'value3',
          path: 'key6',
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
      <ConfigContextProvider>
        <TreeContextProvider tree={{ type: 'null', path: '' }}>
          <TreeView {...props} />
        </TreeContextProvider>
      </ConfigContextProvider>
    </div>
  ),
}
