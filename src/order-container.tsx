"use client"

import React, { useState, ReactNode, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragCancelEvent,
  Modifiers,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { OrderContext, OrderItem } from "./order-context"

export interface OrderContainerProps<T extends OrderItem> {
  /**
   * The initial list of items. Each item must have a unique `id` string.
   */
  initialItems: T[]
  /**
   * The content to render inside the sortable list.
   */
  children: ReactNode
  /**
   * Callback triggered after a successful reorder operation.
   * Receives the newly ordered array of items.
   */
  onReorder?: (items: T[]) => void
  /**
   * Callback triggered when dragging starts.
   */
  onDragStart?: (event: DragStartEvent) => void
  /**
   * Callback triggered when dragging is cancelled.
   */
  onDragCancel?: (event: DragCancelEvent) => void
  /**
   * Which axis the items should be sorted along.
   * - `"vertical"`: standard top-to-bottom list (default).
   * - `"horizontal"`: left-to-right list.
   * - `"both"`: grid layout.
   */
  axis?: "vertical" | "horizontal" | "both"
  /**
   * When true, all drag-and-drop interactions are disabled.
   * Default `false`.
   */
  disabled?: boolean
  /**
   * Array of dnd-kit modifiers to alter the drag behavior
   * (e.g., `restrictToVerticalAxis`, `restrictToWindowEdges`).
   */
  modifiers?: Modifiers
  /**
   * Optional render function for the drag overlay.
   * If provided, a `<DragOverlay>` will be rendered using this function
   * when an item is being dragged, providing a smoother visual experience.
   */
  renderOverlay?: (activeItem: T) => ReactNode
}

/**
 * `<OrderContainer>` is the main wrapper for sortable lists.
 * It provides the drag-and-drop context and manages the internal state of the items.
 */
export function OrderContainer<T extends OrderItem>({
  initialItems,
  children,
  onReorder,
  onDragStart,
  onDragCancel,
  axis = "vertical",
  disabled = false,
  modifiers,
  renderOverlay,
}: OrderContainerProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Dev-time validation
  if (process.env.NODE_ENV !== "production") {
    const ids = new Set(items.map((i) => i.id))
    if (ids.size !== items.length) {
      console.warn(
        "[@iampoul/react-order]: OrderContainer items have duplicate IDs. This will cause unexpected reordering behavior."
      )
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging starts to prevent accidental drags on clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const strategy = useMemo(() => {
    switch (axis) {
      case "horizontal":
        return horizontalListSortingStrategy
      case "both":
        return rectSortingStrategy
      case "vertical":
      default:
        return verticalListSortingStrategy
    }
  }, [axis])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    onDragStart?.(event)
  }

  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveId(null)
    onDragCancel?.(event)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        onReorder?.(newItems)
        return newItems
      })
    }
  }

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId),
    [activeId, items]
  )

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={modifiers}
    >
      <SortableContext items={items} strategy={strategy}>
        <OrderContext.Provider value={{ items, disabled }}>
          <div role="list" aria-roledescription="sortable list">
            {children}
          </div>
        </OrderContext.Provider>
      </SortableContext>
      {renderOverlay && (
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem ? renderOverlay(activeItem) : null}
        </DragOverlay>
      )}
    </DndContext>
  )
}
