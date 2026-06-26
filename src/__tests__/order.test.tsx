import React, { useEffect } from "react"
import { act, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { OrderContainer, OrderItem, useOrder } from "../index"

let dndHandlers: {
  onDragStart?: (event: any) => void
  onDragEnd?: (event: any) => void
  onDragCancel?: (event: any) => void
} = {}

let sortableContextItems: { id: string }[] = []
let sortableDisabled = false

vi.mock("@dnd-kit/core", async () => {
  const react = await import("react")
  return {
    DndContext: ({ children, onDragStart, onDragEnd, onDragCancel }: any) => {
      dndHandlers = { onDragStart, onDragEnd, onDragCancel }
      return react.createElement("div", { "data-testid": "dnd-context" }, children)
    },
    DragOverlay: ({ children }: any) =>
      react.createElement("div", { "data-testid": "drag-overlay" }, children),
    closestCenter: () => null,
    KeyboardSensor: class {},
    PointerSensor: class {},
    useSensor: () => ({}),
    useSensors: (...sensors: any[]) => sensors,
    defaultDropAnimationSideEffects: () => ({}),
  }
})

vi.mock("@dnd-kit/sortable", async () => {
  const react = await import("react")
  return {
    arrayMove: (arr: any[], from: number, to: number) => {
      const next = [...arr]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    },
    SortableContext: ({ children, items }: any) => {
      sortableContextItems = items
      return react.createElement("div", { "data-testid": "sortable-context" }, children)
    },
    sortableKeyboardCoordinates: () => null,
    verticalListSortingStrategy: { name: "vertical" },
    horizontalListSortingStrategy: { name: "horizontal" },
    rectSortingStrategy: { name: "rect" },
    useSortable: ({ id, disabled }: { id: string; disabled?: boolean }) => {
      sortableDisabled = Boolean(disabled)
      return {
        attributes: { "data-attribute-id": id },
        listeners: { onMouseDown: vi.fn() },
        setNodeRef: vi.fn(),
        transform: null,
        transition: "all 200ms",
        isDragging: false,
      }
    },
  }
})

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => "translate3d(0px, 0px, 0px)",
    },
  },
}))

const baseItems = [{ id: "1" }, { id: "2" }, { id: "3" }]

function TestList({ items = baseItems }: { items?: { id: string }[] }) {
  return (
    <>
      {items.map((item) => (
        <OrderItem key={item.id} item={item}>
          {({ attributes, listeners, setNodeRef, style, isDragging }) => (
            <div
              data-testid={`item-${item.id}`}
              data-dragging={String(isDragging)}
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
            >
              Item {item.id}
            </div>
          )}
        </OrderItem>
      ))}
    </>
  )
}

describe("OrderContainer & OrderItem", () => {
  beforeEach(() => {
    dndHandlers = {}
    sortableContextItems = []
    sortableDisabled = false
    vi.clearAllMocks()
  })

  it("renders list container semantics", () => {
    render(
      <OrderContainer initialItems={baseItems}>
        <TestList />
      </OrderContainer>
    )

    expect(screen.getByRole("list")).toHaveAttribute("aria-roledescription", "sortable list")
  })

  it("renders all items with sortable item semantics", () => {
    render(
      <OrderContainer initialItems={baseItems}>
        <TestList />
      </OrderContainer>
    )

    expect(screen.getByTestId("item-1")).toHaveAttribute("role", "listitem")
    expect(screen.getByTestId("item-2")).toHaveAttribute("aria-roledescription", "sortable item")
    expect(screen.getByTestId("item-3")).toBeInTheDocument()
  })

  it("passes disabled state to sortable hook", () => {
    render(
      <OrderContainer initialItems={baseItems} disabled>
        <TestList />
      </OrderContainer>
    )

    expect(sortableDisabled).toBe(true)
  })

  it("uses vertical strategy by default", () => {
    render(
      <OrderContainer initialItems={baseItems}>
        <TestList />
      </OrderContainer>
    )

    expect(sortableContextItems).toEqual(baseItems)
  })

  it("renders drag overlay only when drag is active", () => {
    render(
      <OrderContainer
        initialItems={baseItems}
        renderOverlay={(activeItem) => <div data-testid="overlay">Overlay {activeItem.id}</div>}
      >
        <TestList />
      </OrderContainer>
    )

    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument()
    act(() => {
      dndHandlers.onDragStart?.({ active: { id: "2" } })
    })
    expect(screen.getByTestId("overlay")).toHaveTextContent("Overlay 2")
  })

  it("calls onDragStart callback", () => {
    const onDragStart = vi.fn()
    render(
      <OrderContainer initialItems={baseItems} onDragStart={onDragStart}>
        <TestList />
      </OrderContainer>
    )

    const event = { active: { id: "1" } }
    act(() => {
      dndHandlers.onDragStart?.(event)
    })
    expect(onDragStart).toHaveBeenCalledWith(event)
  })

  it("calls onDragCancel callback and clears active overlay", () => {
    const onDragCancel = vi.fn()
    render(
      <OrderContainer
        initialItems={baseItems}
        onDragCancel={onDragCancel}
        renderOverlay={(activeItem) => <div data-testid="overlay">Overlay {activeItem.id}</div>}
      >
        <TestList />
      </OrderContainer>
    )

    act(() => {
      dndHandlers.onDragStart?.({ active: { id: "3" } })
    })
    expect(screen.getByTestId("overlay")).toHaveTextContent("Overlay 3")
    const event = { active: { id: "3" } }
    act(() => {
      dndHandlers.onDragCancel?.(event)
    })
    expect(onDragCancel).toHaveBeenCalledWith(event)
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument()
  })

  it("calls onReorder with new item order after drag end", () => {
    const onReorder = vi.fn()
    render(
      <OrderContainer initialItems={baseItems} onReorder={onReorder}>
        <TestList />
      </OrderContainer>
    )

    act(() => {
      dndHandlers.onDragEnd?.({ active: { id: "1" }, over: { id: "3" } })
    })
    expect(onReorder).toHaveBeenCalledWith([{ id: "2" }, { id: "3" }, { id: "1" }])
  })

  it("does not reorder when dropped over same item", () => {
    const onReorder = vi.fn()
    render(
      <OrderContainer initialItems={baseItems} onReorder={onReorder}>
        <TestList />
      </OrderContainer>
    )

    act(() => {
      dndHandlers.onDragEnd?.({ active: { id: "1" }, over: { id: "1" } })
    })
    expect(onReorder).not.toHaveBeenCalled()
  })

  it("syncs internal items when initialItems prop changes", () => {
    function Wrapper() {
      const [items, setItems] = React.useState(baseItems)
      useEffect(() => {
        setItems([{ id: "a" }, { id: "b" }])
      }, [])

      return (
        <OrderContainer initialItems={items}>
          <TestList items={items} />
        </OrderContainer>
      )
    }

    render(<Wrapper />)
    expect(screen.getByTestId("item-a")).toBeInTheDocument()
    expect(screen.queryByTestId("item-1")).not.toBeInTheDocument()
  })

  it("exposes context values via useOrder", () => {
    function Probe() {
      const { items, axis, disabled, activeId } = useOrder<{ id: string }>()
      return (
        <div data-testid="probe">
          {items.length}:{axis}:{String(disabled)}:{String(activeId)}
        </div>
      )
    }

    render(
      <OrderContainer initialItems={baseItems} axis="horizontal" disabled>
        <Probe />
      </OrderContainer>
    )

    expect(screen.getByTestId("probe")).toHaveTextContent("3:horizontal:true:null")
  })

  it("throws when useOrder is used outside provider", () => {
    function InvalidProbe() {
      useOrder()
      return null
    }

    expect(() => render(<InvalidProbe />)).toThrow(
      "useOrder must be used within an <OrderContainer>."
    )
  })
})
