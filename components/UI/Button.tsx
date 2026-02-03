import React from 'react';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) {
    return null;
  }

  return React.cloneElement(children, {
    ...props,
    ref,
    className: [className, (children.props as { className?: string }).className]
      .filter(Boolean)
      .join(' ')
  });
});

Slot.displayName = 'Slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  icon,
  asChild = false,
  type,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-blue to-accent-indigo text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-transparent rounded-md",
    secondary: "bg-surface-highlight border border-border text-gray-200 hover:border-gray-500 hover:text-white rounded-md backdrop-blur-sm",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 rounded-md"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5"
  };
  const Comp = asChild ? Slot : 'button';
  const componentProps = asChild ? props : { type: type ?? 'button', ...props };

  return (
    <Comp 
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...componentProps}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

export default Button;