import React, { useState, ReactNode } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { OrderContext, OrderItem } from "./order-context"

/**
 * Props for the OrderContainer component.
 */
export interface OrderContainerProps<T extends OrderItem> {
  /** The initial list of items. Must have unique IDs. */
  initialItems: T[]
  children: ReactNode
  /** Callback triggered after reordering. */
  onReorder?: (items: T[]) => void
  /** Dnd-kit sorting strategy. Defaults to verticalListSortingStrategy. */
  strategy?: SortingStrategy
}

/**
 * A container that provides the context and drag-and-drop state management.
 */
export function OrderContainer<T extends OrderItem>({
  initialItems,
  children,
  onReorder,
  strategy = verticalListSortingStrategy,
}: OrderContainerProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)

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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={strategy}>
        <OrderContext.Provider value={{ items }}>
          <div role="list" aria-roledescription="sortable list">
            {children}
          </div>
        </OrderContext.Provider>
      </SortableContext>
    </DndContext>
  )
}
