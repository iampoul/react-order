import { createContext, useContext } from "react"

export interface OrderItem {
  id: string
}

export interface OrderContextValue<T extends OrderItem> {
  items: T[]
  // MoveItem is handled by dnd-kit's onDragEnd
}

export const OrderContext = createContext<OrderContextValue<any> | undefined>(
  undefined
)

export function useOrder<T extends OrderItem>() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderContainer")
  }
  return context as OrderContextValue<T>
}
