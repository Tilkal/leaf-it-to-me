import type { Meta, StoryObj } from '@storybook/react'

import { VariantState } from '../../defs'
import { Tick } from '../icons/Tick'
import { X } from '../icons/X'
import { ToolbarItem } from './ToolbarItem'
import { Toolbar } from './index'

import '../../root.css'

const meta: Meta<typeof Toolbar> = {
  title: 'Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Toolbar>

export const Default: Story = {
  args: {
    children: (
      <>
        <ToolbarItem icon={<Tick />} onClick={() => console.log('clicked yes')}>
          Yes
        </ToolbarItem>
        <ToolbarItem
          icon={<X />}
          onClick={() => console.log('clicked no')}
          variant={VariantState.ERROR}
        >
          No
        </ToolbarItem>
      </>
    ),
  },
}
