import { useRef, type TransitionState, useEffect } from "kaioken"
import { Backdrop } from "./Backdrop"

type DrawerProps = {
  state: TransitionState
  close: () => void
  children: JSX.Children
}

export function Drawer({ state, close, children }: DrawerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  if (state == "exited") return null
  const opacity = state === "entered" ? "1" : "0"
  const translateX = state === "entered" ? 0 : 100

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress)
    return () => window.removeEventListener("keyup", handleKeyPress)
  }, [])

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  return (
    <Backdrop
      ref={wrapperRef}
      onclick={(e) => e.target === wrapperRef.current && close()}
      style={{ opacity }}
    >
      <div
        className="drawer-content p-2"
        style={{ transform: `translateY(${translateX}%)` }}
      >
        {children}
      </div>
    </Backdrop>
  )
}
