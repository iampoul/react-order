import React, { ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { OrderItem } from "./order-context"

/**
 * A wrapper for draggable list items.
 * Must be used within an `OrderContainer`.
 */
export interface OrderItemProps<T extends OrderItem> {
  item: T
  children: (props: {
    attributes: React.HTMLAttributes<HTMLElement>
    listeners: React.HTMLAttributes<HTMLElement>
    setNodeRef: (node: HTMLElement | null) => void
    style: React.CSSProperties
  }) => ReactNode
}

export function OrderItemComponent<T extends OrderItem>({
  item,
  children,
}: OrderItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Inject ARIA and screen reader instructions
  const enhancedAttributes = {
    ...attributes,
    role: "listitem",
    "aria-roledescription": "sortable item",
  }

  return children({
    attributes: enhancedAttributes,
    listeners: (listeners || {}) as React.HTMLAttributes<HTMLElement>,
    setNodeRef,
    style,
  })
}
