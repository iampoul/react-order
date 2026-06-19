"use client"

import React, { ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { OrderItem, useOrder } from "./order-context"

/**
 * Props for the OrderItem component.
 */
export interface OrderItemProps<T extends OrderItem> {
  /** The item data. Must include a unique `id`. */
  item: T
  /**
   * Render prop function that provides the necessary attributes and listeners
   * to attach to the draggable DOM element.
   */
  children: (props: {
    /** Attributes to spread onto the root element of the item. */
    attributes: React.HTMLAttributes<HTMLElement>
    /**
     * Event listeners to spread onto the drag handle element.
     * If the whole item is draggable, spread this on the root element.
     */
    listeners: React.HTMLAttributes<HTMLElement>
    /** Ref callback to attach to the root element. */
    setNodeRef: (node: HTMLElement | null) => void
    /** Inline styles for positioning and transitions during drag. */
    style: React.CSSProperties
    /** Whether this specific item is currently being dragged. */
    isDragging: boolean
  }) => ReactNode
}

/**
 * A wrapper for draggable list items.
 * Must be used within an `<OrderContainer>`.
 */
export function OrderItemComponent<T extends OrderItem>({
  item,
  children,
}: OrderItemProps<T>) {
  const { disabled } = useOrder()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 999 } : {}),
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
    isDragging,
  })
}
