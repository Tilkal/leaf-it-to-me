import type { Meta, StoryObj } from '@storybook/react'

import { Popover } from './Popover'

import '../root.css'

const meta: Meta<typeof Popover> = {
  title: 'Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {
    content: 'Simple long content popover',
    children: (
      <div
        style={{
          border: '1px solid black',
          padding: '4px 8px',
        }}
      >
        Children
      </div>
    ),
  },
}
