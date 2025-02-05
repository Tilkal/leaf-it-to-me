import { Node } from '../defs'

export const hasNode = (node: Node, tree: Node): boolean =>
  tree.path === node.path ||
  tree.children?.some((childTree) => hasNode(node, childTree)) ||
  false

export const addNodeToTree = (
  parentNode: Node,
  childNode: Node,
  tree: Node,
): Node => {
  // Check if parentNode is in tree
  if (!hasNode(parentNode, tree))
    throw new Error(`Parent node with path ${parentNode.path} not found.`)

  // Check if childNode path is valid
  if (
    // Must be child node
    !childNode.path.startsWith(parentNode.path) ||
    // Must be direct child of parent
    childNode.path.replace(`${parentNode.path}.`, '').split('.').length !== 1
  ) {
    throw new Error(`Child node has invalid path (${childNode.path}).`)
  }

  if (tree.path === parentNode.path) {
    // Must not replace existing node
    if (tree.children?.some((child) => child.path === childNode.path))
      throw new Error(
        `A child node with path ${childNode.path} already exists.`,
      )

    return {
      ...tree,
      children: [...(tree.children ?? []), childNode],
    }
  }

  return {
    ...tree,
    children: tree.children?.map((childTree) =>
      // Only explore child tree containing the parent node
      hasNode(parentNode, childTree)
        ? addNodeToTree(parentNode, childNode, childTree)
        : childTree,
    ),
  }
}

export const deleteNodeInTree = (node: Node, tree: Node): Node => {
  // Must not delete the root tree
  if (node.path === tree.path) throw new Error('Root node cannot be deleted.')

  // Return early if node not found in tree
  if (!hasNode(node, tree)) return tree

  if (tree.children?.some((child) => child.path === node.path)) {
    return {
      ...tree,
      children: tree.children.filter(
        (childNode) => childNode.path !== node.path,
      ),
    }
  }

  return {
    ...tree,
    children: tree.children?.map((childTree) =>
      deleteNodeInTree(node, childTree),
    ),
  }
}

const getParentPath = (node: Node): string => {
  const pathArray = node.path.split('.')
  const parentPath = pathArray.slice(0, pathArray.length - 1).join('.')
  return parentPath
}

export const updateNodeInTree = (
  oldNode: Node,
  newNode: Node,
  tree: Node,
): Node => {
  // If replacing root, return early
  if (newNode.path === tree.path && oldNode.path === tree.path) return newNode

  // Old node must exists in tree
  if (!hasNode(oldNode, tree))
    throw new Error(`Node with path ${oldNode.path} not found.`)

  // Cannot replace a different node from the updating one
  if (
    hasNode(oldNode, tree) &&
    hasNode(newNode, tree) &&
    oldNode.path !== newNode.path
  )
    throw new Error(`A node already exists at path "${newNode.path}"`)

  const newParentPath = getParentPath(newNode)
  const oldParentPath = getParentPath(oldNode)

  // If the node change path and nesting (different parent), remove old one and add new one
  if (oldParentPath !== newParentPath) {
    const maybeParentNode: Node = {
      type: 'object', // Required but has no effect, so 'object' is fine
      path: newParentPath,
    }

    // Check if new node path can reach a real element in tree
    if (!hasNode(maybeParentNode, tree))
      throw new Error(`Updated node has invalid path (${newNode.path}).`)

    const deletedOldNodeTree = deleteNodeInTree(oldNode, tree)
    const updatedTree = addNodeToTree(
      maybeParentNode,
      newNode,
      deletedOldNodeTree,
    )
    return updatedTree
  }

  // Replace old node if paths are the same or parent node is the same
  if (tree.children?.some((child) => child.path === oldNode.path)) {
    return {
      ...tree,
      children: tree.children.map((childNode) =>
        childNode.path === oldNode.path ? newNode : childNode,
      ),
    }
  }

  return {
    ...tree,
    children: tree.children?.map((childTree) =>
      hasNode(oldNode, childTree)
        ? updateNodeInTree(oldNode, newNode, childTree)
        : childTree,
    ),
  }
}
