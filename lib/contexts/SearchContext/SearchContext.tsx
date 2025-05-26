import { Dispatch, SetStateAction, createContext, useContext } from 'react'

import { Node } from '../../defs'

export type SearchContextProps = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  matchSearch: (node: Node) => boolean
}

export const SearchContext = createContext<SearchContextProps>(
  {} as SearchContextProps,
)

export const useSearchContext = () => useContext(SearchContext)
