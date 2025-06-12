import { ElementProps } from "kaioken"

export function DialogFooter({
  children,
  className,
  ...rest
}: ElementProps<"div">) {
  return (
    <div
      className={`pt-2 flex justify-between items-center ${className || ""}`}
      {...rest}
    >
      {children}
    </div>
  )
}
