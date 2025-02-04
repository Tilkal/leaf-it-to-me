import type { Meta, StoryObj } from '@storybook/react'

import { VariantState } from '../../defs'
import { Popover } from './Popover'

import '../../root.css'

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

export const AlwaysVisible: Story = {
  args: {
    content: 'Simple long content popover',
    keepOpen: true,
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

export const Info: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.INFO,
    keepOpen: true,
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

export const Warning: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.WARNING,
    keepOpen: true,
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

export const Error: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.ERROR,
    keepOpen: true,
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
