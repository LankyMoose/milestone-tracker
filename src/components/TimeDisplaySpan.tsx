import { Time } from "../state"

export function TimeDisplaySpan(props: {
  time: Omit<Time, "hundredths"> | Time | null
}) {
  if (props.time === null) {
    return <span className="font-mono bg-black/30 px-2 grow rounded">N/A</span>
  }
  const { hours, minutes, seconds } = props.time
  let str = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`
  if ("hundredths" in props.time) {
    str += `.${String(props.time.hundredths).padStart(2, "0")}`
  }
  return <span className="font-mono bg-black/30 px-2 rounded">{str}</span>
}
