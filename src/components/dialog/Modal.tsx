import { useRef, type TransitionState, useEffect } from "kaioken"
import { Backdrop } from "./Backdrop"

type ModalProps = {
  state: TransitionState
  close: () => void
  children: JSX.Children
}

export function Modal({ state, close, children }: ModalProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const didPtrDownBackdrop = useRef(false)
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        if (state === "exited") return
        close()
      }
    }
    window.addEventListener("keyup", handleKeyPress)
    return () => window.removeEventListener("keyup", handleKeyPress)
  }, [state])

  if (state == "exited") return null

  const opacity = state === "entered" ? "1" : "0"
  const scale = state === "entered" ? 1 : 0.85
  const translateY = state === "entered" ? -50 : -25

  return (
    <Backdrop
      ref={wrapperRef}
      onpointerdown={(e) =>
        e.target === wrapperRef.current && (didPtrDownBackdrop.current = true)
      }
      onpointerup={(e) =>
        e.target === wrapperRef.current &&
        didPtrDownBackdrop.current &&
        ((didPtrDownBackdrop.current = false), close())
      }
      //onclick={(e) => e.target === wrapperRef.current && close()}
      style={{ opacity }}
    >
      <div
        className="modal-content p-2"
        style={{
          transform: `translate(-50%, ${translateY}%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </Backdrop>
  )
}
