import { memo, ElementProps } from "kaioken"

export const Button = memo(function Button(props: ElementProps<"button">) {
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
