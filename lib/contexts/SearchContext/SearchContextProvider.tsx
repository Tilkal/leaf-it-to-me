import React, { PropsWithChildren, useCallback, useState } from 'react'

import { Node } from '../../defs'
import { SearchContext } from './SearchContext'

export const SearchContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [search, setSearch] = useState('')

  const matchSearch = useCallback(
    (node: Node) => {
      const keyMatch =
        search && node.name?.toLowerCase().includes(search.toLowerCase())
      const valueMatch =
        search &&
        ((typeof node.value === 'string' &&
          node.value.toLowerCase().includes(search.toLowerCase())) ||
          (typeof node.value === 'number' &&
            String(node.value).includes(search.toLowerCase())))

      return Boolean(keyMatch || valueMatch)
    },
    [search],
  )

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        matchSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
