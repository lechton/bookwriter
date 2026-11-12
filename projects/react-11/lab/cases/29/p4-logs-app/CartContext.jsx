import { createContext } from 'react';

export const CartContext = createContext(null); // Will carry the current cart
export const CartDispatchContext = createContext(null); // Will carry the dispatch function
