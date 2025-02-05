import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef } from 'react'

import { VariantState } from '../../defs'
import { Popover, PopoverProps } from './Popover'

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

const ComponentWithPopover: React.FC<PopoverProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div style={{ position: 'relative' }}>
      <Popover {...props} targetRef={ref} />
      <div
        ref={ref}
        style={{
          border: '1px solid black',
          padding: '4px 8px',
        }}
      >
        Component with popover
      </div>
    </div>
  )
}

export const Default: Story = {
  args: {
    content: 'Simple long content popover',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const AlwaysVisible: Story = {
  args: {
    content: 'Simple long content popover',
    keepOpen: true,
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Info: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.INFO,
    keepOpen: true,
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Warning: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.WARNING,
    keepOpen: true,
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Error: Story = {
  args: {
    content: 'Simple long content popover',
    variant: VariantState.ERROR,
    keepOpen: true,
  },
  render: (props) => <ComponentWithPopover {...props} />,
}
