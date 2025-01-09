import type { Meta, StoryObj } from "@storybook/react"

import { VisualJSONEditor } from "./VisualJSONEditor"
import config from "./config.json"

const meta: Meta<typeof VisualJSONEditor> = {
  title: "VisualJSONEditor",
  component: VisualJSONEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof VisualJSONEditor>

export const Default: Story = {
  args: {
    tree: config,
  },
}
