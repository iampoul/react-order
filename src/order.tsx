import React, { ReactNode } from "react"

export interface OrderProps {
  children: ReactNode
}

export function Order({ children }: OrderProps) {
  return <>{children}</>
}
