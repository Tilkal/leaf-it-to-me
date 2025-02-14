import type { Meta, StoryObj } from '@storybook/react'

import { ConfigContextProvider } from '../contexts/ConfigContext/ConfigContextProvider'
import { ErrorDisplay } from './ErrorDisplay'

import '../root.css'

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Error',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ErrorDisplay>

export const Default: Story = {
  args: {
    message:
      'Node at path "some.path.for.story" has an unsupported type (bigint).',
  },
  render: (props) => (
    <ConfigContextProvider>
      <ErrorDisplay {...props} />
    </ConfigContextProvider>
  ),
}
