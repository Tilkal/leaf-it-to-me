import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef } from 'react'

import { VariantState } from '../../defs'
import { Popover, PopoverProps } from './index'

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

export const ComponentAsContent: Story = {
  args: {
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
        <div
          style={{
            backgroundColor: 'var(--violet-3)',
            padding: '6px',
            borderRadius: '3px',
          }}
        >
          Col 1
        </div>
        <div
          style={{
            backgroundColor: 'var(--blue-3)',
            padding: '6px',
            borderRadius: '3px',
          }}
        >
          Col 2
        </div>
        <div
          style={{
            backgroundColor: 'var(--green-3)',
            padding: '6px',
            borderRadius: '3px',
          }}
        >
          Col 3
        </div>
      </div>
    ),
    keepOpen: true,
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Top: Story = {
  args: {
    content: 'Position top',
    keepOpen: true,
    position: 'top',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Bottom: Story = {
  args: {
    content: 'Position bottom',
    keepOpen: true,
    position: 'bottom',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Left: Story = {
  args: {
    content: 'Position left',
    keepOpen: true,
    position: 'left',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const Right: Story = {
  args: {
    content: 'Position right',
    keepOpen: true,
    position: 'right',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}

export const PositionAuto: Story = {
  args: {
    content: 'Position auto',
    keepOpen: true,
    position: 'auto',
  },
  render: (props) => <ComponentWithPopover {...props} />,
}
