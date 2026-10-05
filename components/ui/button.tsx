import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-btn hover:-translate-y-px hover:bg-primary-light active:bg-primary-dark",
        secondary:
          "border border-line bg-card text-fg shadow-card hover:border-primary-light/50 hover:bg-rowhover",
        ghost: "text-fg-slate hover:bg-rowhover hover:text-primary",
        // Sobre fondo azul (banner final)
        inverse: "bg-white text-primary shadow-card hover:-translate-y-px hover:bg-rowhover",
        whatsapp: "bg-success text-white shadow-card hover:-translate-y-px hover:bg-success-text",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
