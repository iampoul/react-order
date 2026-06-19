import { useState } from "react"
import { OrderContainer, OrderItem } from "@iampoul/react-order"
import "./index.css"

const initialItems = [
  { id: "1", text: "1" },
  { id: "2", text: "2" },
  { id: "3", text: "3" },
  { id: "4", text: "4" },
  { id: "5", text: "5" },
  { id: "6", text: "6" },
]

function SortableList({
  title,
  items,
  axis,
  disabled = false,
  useOverlay = false,
}: {
  title: string
  items: typeof initialItems
  axis: "vertical" | "horizontal" | "both"
  disabled?: boolean
  useOverlay?: boolean
}) {
  const [list, setList] = useState(items)

  const getContainerStyle = () => {
    if (axis === "both") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
        width: "fit-content",
      }
    }
    return {
      display: "flex",
      flexDirection: axis === "vertical" ? ("column" as const) : ("row" as const),
      gap: "8px",
    }
  }

  const getItemStyle = (isDragging: boolean) => ({
    padding: "16px",
    background: isDragging ? "#c0c0c0" : "#e0e0e0",
    border: "1px solid #999",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "grab",
    width: axis === "horizontal" ? "60px" : "200px",
    textAlign: "center" as const,
    opacity: isDragging && useOverlay ? 0 : 1, // Hide original item if using overlay
  })

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3>{title}</h3>
      <OrderContainer
        initialItems={list}
        onReorder={setList}
        axis={axis}
        disabled={disabled}
        renderOverlay={
          useOverlay
            ? (activeItem) => (
              <div
                style={{
                  ...getItemStyle(true),
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  cursor: "grabbing",
                }}
              >
                {activeItem.text}
              </div>
            )
            : undefined
        }
      >
        <div style={getContainerStyle()}>
          {list.map((item) => (
            <OrderItem key={item.id} item={item}>
              {({ attributes, listeners, setNodeRef, style, isDragging }) => (
                <div
                  ref={setNodeRef}
                  style={{
                    ...style,
                    ...getItemStyle(isDragging),
                  }}
                  {...attributes}
                  {...listeners}
                >
                  {item.text}
                </div>
              )}
            </OrderItem>
          ))}
        </div>
      </OrderContainer>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>React Order Demo</h1>
      <p>Showcasing the new features of the react-order package.</p>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div>
          <SortableList title="Vertical (Default)" items={initialItems.slice(0, 3)} axis="vertical" />
          <SortableList title="Horizontal" items={initialItems.slice(0, 3)} axis="horizontal" />
        </div>

        <div>
          <SortableList title="Grid Layout (axis='both')" items={initialItems} axis="both" />
        </div>

        <div>
          <SortableList title="With Drag Overlay" items={initialItems.slice(0, 3)} axis="vertical" useOverlay />
          <SortableList title="Disabled" items={initialItems.slice(0, 3)} axis="vertical" disabled />
        </div>
      </div>
    </div>
  )
}
