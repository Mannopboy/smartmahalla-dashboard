import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Normal Input ---------- */

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
    <input
        ref={ref}
        type={type}
        className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
        )}
        {...props}
    />
));

Input.displayName = "Input";

/* ---------- OTP Input ---------- */

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
    <OTPInput
        ref={ref}
        containerClassName={cn(
            "flex items-center gap-2 has-[:disabled]:opacity-50",
            containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
    />
));

InputOTP.displayName = "InputOTP";

/* ---------- OTP Group ---------- */

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
));

InputOTPGroup.displayName = "InputOTPGroup";

/* ---------- OTP Slot ---------- */

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                isActive && "z-10 ring-2 ring-ring ring-offset-background",
                className
            )}
            {...props}
        >
            {char}

            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                </div>
            )}
        </div>
    );
});

InputOTPSlot.displayName = "InputOTPSlot";

/* ---------- OTP Separator ---------- */

const InputOTPSeparator = React.forwardRef((props, ref) => (
    <div ref={ref} role="separator" {...props}>
        <Dot />
    </div>
));

InputOTPSeparator.displayName = "InputOTPSeparator";

/* ---------- Export ---------- */

export { Input, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };