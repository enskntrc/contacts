import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";
import { Icon } from "../icons";

import type { IconName } from "../types/icon";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        destructive:
          "relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-rose-500 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-rose-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700",
        constructive:
          "relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-lime-500 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700",
        stimulative:
          "relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-amber-500 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-amber-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: IconName;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, icon, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon ? (
          <Icon name={icon} className="-ml-0.5 mr-3 h-5 w-5 bg-" />
        ) : null}
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
