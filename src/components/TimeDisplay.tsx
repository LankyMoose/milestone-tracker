import { Time } from "../state"

export function TimeDisplay(props: { time: Time }) {
  const { hours, minutes, seconds, hundredths } = props.time
  return (
    <>
      <span className="text-5xl">
        {hours > 0 ? `${hours}:` : ""}
        {minutes > 0 ? `${minutes}:` : ""}
        {String(seconds).padStart(minutes > 0 ? 2 : 1, "0")}
      </span>
      <span className="text-4xl">.{String(hundredths).padStart(2, "0")}</span>
    </>
  )
}
