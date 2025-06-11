import { ElementProps, memo, Derive, useRef, useSignal } from "kaioken"

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const hundredths = Math.floor((ms % 1000) / 10)

  return { hours, minutes, seconds, hundredths }
}

export function Stopwatch() {
  const offset = useRef(0) // Last reference time
  const interval = useSignal(-1) // Interval ID or -1 if stopped
  const time = useSignal(0) // Accumulated time in ms

  const start = () => {
    if (interval.value === -1) {
      offset.current = performance.now()
      interval.value = window.setInterval(() => {
        const now = performance.now()
        const delta = now - offset.current
        offset.current = now
        time.value += delta
      }, 1000 / 60)
    }
  }

  const pause = () => {
    if (interval.value !== -1) {
      clearInterval(interval.value)
      interval.value = -1
    }
  }

  const reset = () => {
    pause()
    time.value = 0
  }

  return (
    <div className="grow flex flex-col gap-8 justify-center items-center">
      <span className="font-bold select-none font-mono">
        <Derive from={time}>
          {(time) => {
            const { hours, minutes, seconds, hundredths } = formatTime(time)
            return (
              <>
                <span className="text-5xl">
                  {hours > 0 ? `${hours}:` : ""}
                  {minutes > 0 ? `${minutes}:` : ""}
                  {String(seconds).padStart(minutes > 0 ? 2 : 1, "0")}
                </span>
                <span className="text-4xl">
                  .{String(hundredths).padStart(2, "0")}
                </span>
              </>
            )
          }}
        </Derive>
      </span>
      <div className="flex gap-4 justify-center items-center">
        <Derive from={[interval, time]}>
          {(interval, time) => (
            <>
              <Button disabled={interval !== -1} onclick={start}>
                Start
              </Button>
              <Button disabled={interval === -1} onclick={pause}>
                Pause
              </Button>
              <Button disabled={time === 0} onclick={reset}>
                Reset
              </Button>
            </>
          )}
        </Derive>
      </div>
    </div>
  )
}

const Button = memo(function Button(props: ElementProps<"button">) {
  return (
    <button
      {...props}
      className={[
        "bg-red-800 cursor-pointer px-2 py-1 border border-white/15 rounded",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-red-900 hover:border-white/5 active:opacity-75",
      ].join(" ")}
    >
      {props.children}
    </button>
  )
})
