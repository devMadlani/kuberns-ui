import * as React from "react";
import { cn } from "../../lib/utils";
import { Check, ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
};

const readText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((entry) => readText(entry)).join("");
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return readText(element.props.children);
  }

  return "";
};

const extractOptions = (children: React.ReactNode): SelectOption[] => {
  const options: SelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    const element = child as React.ReactElement<{
      value?: string | number;
      label?: string;
      disabled?: boolean;
      children?: React.ReactNode;
    }>;

    if (element.type === "option") {
      options.push({
        value: String(element.props.value ?? ""),
        label: readText(element.props.children),
        disabled: Boolean(element.props.disabled),
      });
      return;
    }

    if (element.type === "optgroup") {
      const groupLabel = String(element.props.label ?? "");

      React.Children.forEach(element.props.children, (groupChild) => {
        if (!React.isValidElement(groupChild) || groupChild.type !== "option") {
          return;
        }
        const groupOption = groupChild as React.ReactElement<{
          value?: string | number;
          disabled?: boolean;
          children?: React.ReactNode;
        }>;

        options.push({
          value: String(groupOption.props.value ?? ""),
          label: readText(groupOption.props.children),
          disabled: Boolean(groupOption.props.disabled),
          group: groupLabel,
        });
      });
    }
  });

  return options;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onChange, disabled, id, name, ...rest }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const options = React.useMemo(() => extractOptions(children), [children]);
    const selectedValue = String(value ?? "");
    const selectedOption = options.find((option) => option.value === selectedValue) ?? null;
    const placeholder = options.find((option) => option.value === "")?.label ?? "Select option";

    React.useEffect(() => {
      const onPointerDown = (event: MouseEvent): void => {
        if (!containerRef.current) {
          return;
        }

        if (!containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      const onEscape = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", onPointerDown);
      window.addEventListener("keydown", onEscape);

      return () => {
        document.removeEventListener("mousedown", onPointerDown);
        window.removeEventListener("keydown", onEscape);
      };
    }, []);

    const emitChange = (nextValue: string): void => {
      if (!onChange) {
        return;
      }

      const syntheticEvent = {
        target: { value: nextValue, id, name },
        currentTarget: { value: nextValue, id, name },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    };

    const groups = options.reduce<Record<string, SelectOption[]>>((acc, option) => {
      const key = option.group ?? "";
      acc[key] = acc[key] ?? [];
      acc[key].push(option);
      return acc;
    }, {});

    const orderedGroups = Object.entries(groups);

    return (
      <div ref={containerRef} className="relative w-full">
        <select
          className="sr-only"
          ref={ref}
          value={selectedValue}
          onChange={onChange}
          disabled={disabled}
          id={id}
          name={name}
          {...rest}
        >
          {children}
        </select>

        <button
          type="button"
          id={id ? `${id}-trigger` : undefined}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left ring-offset-background transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open ? "rotate-180" : "",
            )}
          />
        </button>

        {open ? (
          <div className="absolute z-40 mt-2 w-full rounded-md border border-border bg-popover shadow-lg">
            <div className="max-h-72 overflow-auto py-1">
              {orderedGroups.map(([group, groupOptions]) => (
                <div key={group || "default"}>
                  {group ? (
                    <div className="px-2 py-1.5">
                      <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {group}
                      </p>
                    </div>
                  ) : null}
                  <div role="listbox" aria-label={group || "Options"}>
                    {groupOptions.map((option) => {
                      const isSelected = option.value === selectedValue;

                      return (
                        <button
                          key={`${group}-${option.value}`}
                          type="button"
                          disabled={option.disabled}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted",
                            option.disabled ? "cursor-not-allowed opacity-50" : "",
                          )}
                          onClick={() => {
                            if (option.disabled) {
                              return;
                            }

                            emitChange(option.value);
                            setOpen(false);
                          }}
                        >
                          <span>{option.label}</span>
                          {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
