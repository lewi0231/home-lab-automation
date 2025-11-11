import { cn } from "@/lib/utils";

function Header({
  children,
  textClassName,
}: {
  children: string;
  textClassName?: string;
}) {
  return (
    <header className="flex justify-center flex-col items-start w-1/2">
      <h2
        className={cn(
          "text-5xl py-6 text-left w-full tracking-tight",
          textClassName
        )}
      >
        {children}
      </h2>
      <p className="text-sm text-muted-foreground">
        Please add or alter the default values as you like. Note that setting
        changes will be lost on page refresh.
      </p>
    </header>
  );
}

export default Header;
