import * as React from "react";

type TabsProps = {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
};

type TabsListProps = {
  className?: string;
  children: React.ReactNode;
  active?: string;
  setActive?: (v: string) => void;
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: string;
  setActive?: (v: string) => void;
};

type TabsContentProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
  active?: string;
};

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [active, setActive] = React.useState(defaultValue);

  // Only inject props into known tab components
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    // Only inject props into our own components
    if ((child.type === TabsList) || (child.type === TabsContent)) {
      return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
    }
    return child;
  });

  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
}

export function TabsList({ className, children, active, setActive }: TabsListProps) {
  // Only inject props into known tab triggers
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    if (child.type === TabsTrigger) {
      return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
    }
    return child;
  });
  return <div className={className}>{childrenWithProps}</div>;
}

export function TabsTrigger({ value, children, className = '', active, setActive }: TabsTriggerProps) {
  const isActive = active === value;
  return (
    <button
      className={`px-4 py-2 rounded-t ${isActive ? "bg-white shadow font-bold" : "bg-gray-100"} transition ${className}`}
      onClick={() => setActive && setActive(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, active }: TabsContentProps) {
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
}