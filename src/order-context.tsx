"use client"

import { createContext, useContext } from "react"

/**
 * Represents a single sortable item.
 * Must include a unique `id` string.
 */
export interface OrderItem {
  id: string
}

/**
 * The context value provided by the `<OrderContainer>`.
 */
export interface OrderContextValue<T extends OrderItem> {
  /** The current list of items in their sorted order. */
  items: T[]
  /** Whether the drag-and-drop functionality is currently disabled. */
  disabled: boolean
  /** The ID of the currently dragged item, or null if nothing is being dragged. */
  activeId: string | null
  /** The axis the items are being sorted along. */
  axis: "vertical" | "horizontal" | "both"
}

export const OrderContext = createContext<OrderContextValue<any> | null>(null)

/**
 * Hook to access the current order state.
 * Must be used within an `<OrderContainer>`.
 */
export function useOrder<T extends OrderItem>(): OrderContextValue<T> {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an <OrderContainer>.")
  }
  return context as OrderContextValue<T>
}
