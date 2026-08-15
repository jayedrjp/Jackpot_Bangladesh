import clsx from "clsx";

export default function Badge({
  children,
  variant = "red",
}: {
  children: React.ReactNode;
  variant?: "red" | "black" | "gray";
}) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
        variant === "red" && "bg-jackpot-red text-white",
        variant === "black" && "bg-jackpot-black text-white",
        variant === "gray" && "bg-gray-100 text-jackpot-gray"
      )}
    >
      {children}
    </span>
  );
}
