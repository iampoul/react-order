import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { OrderContainer, OrderItem } from "../index"

describe("OrderContainer & OrderItem", () => {
  const initialItems = [{ id: "1" }, { id: "2" }, { id: "3" }]

  it("renders correctly with default props", () => {
    render(
      <OrderContainer initialItems={initialItems}>
        {initialItems.map((item) => (
          <OrderItem key={item.id} item={item}>
            {({ attributes, listeners, setNodeRef, style }) => (
              <div
                data-testid={`item-${item.id}`}
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
      </OrderContainer>
    )

    expect(screen.getByTestId("item-1")).toBeInTheDocument()
    expect(screen.getByTestId("item-3")).toBeInTheDocument()
  })

  it("renders correctly when disabled", () => {
    render(
      <OrderContainer initialItems={initialItems} disabled>
        {initialItems.map((item) => (
          <OrderItem key={item.id} item={item}>
            {({ attributes, listeners, setNodeRef, style }) => (
              <div
                data-testid={`item-${item.id}`}
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
      </OrderContainer>
    )

    expect(screen.getByTestId("item-1")).toBeInTheDocument()
  })

  it("renders correctly with renderOverlay", () => {
    render(
      <OrderContainer
        initialItems={initialItems}
        renderOverlay={(activeItem) => (
          <div data-testid="overlay">Overlay {activeItem.id}</div>
        )}
      >
        {initialItems.map((item) => (
          <OrderItem key={item.id} item={item}>
            {({ attributes, listeners, setNodeRef, style }) => (
              <div
                data-testid={`item-${item.id}`}
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
      </OrderContainer>
    )

    expect(screen.getByTestId("item-1")).toBeInTheDocument()
    // Overlay is only rendered when dragging, so it shouldn't be in the document initially
    expect(screen.queryByTestId("overlay")).not.toBeInTheDocument()
  })
})
