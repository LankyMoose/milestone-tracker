import { memo, ElementProps } from "kaioken"

export const Button = memo(function Button(props: ElementProps<"button">) {
  return (
    <button
      {...props}
      className={[
        "bg-purple-950 cursor-pointer px-2 py-1 border border-white/10 rounded",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-purple-900 hover:border-white/5 active:opacity-75",
        props.className,
      ].join(" ")}
    >
      {props.children}
    </button>
  )
})
