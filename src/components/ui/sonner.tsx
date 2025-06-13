import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      closeButton
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-50 group-[.toast]:to-purple-50 group-[.toast]:hover:from-blue-100 group-[.toast]:hover:to-purple-100 group-[.toast]:text-blue-700 group-[.toast]:hover:text-blue-800 group-[.toast]:border group-[.toast]:border-blue-200 group-[.toast]:hover:border-blue-300 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:font-medium group-[.toast]:rounded-md dark:group-[.toast]:from-blue-900/20 dark:group-[.toast]:to-purple-900/20 dark:group-[.toast]:hover:from-blue-800/30 dark:group-[.toast]:hover:to-purple-800/30 dark:group-[.toast]:text-blue-300 dark:group-[.toast]:hover:text-blue-200 dark:group-[.toast]:border-blue-700 dark:group-[.toast]:hover:border-blue-600",
          closeButton:
            "group-[.toast]:absolute group-[.toast]:right-2 group-[.toast]:top-2 group-[.toast]:text-blue-700 group-[.toast]:hover:text-blue-800 group-[.toast]:border group-[.toast]:border-blue-200 group-[.toast]:hover:border-blue-300 group-[.toast]:shadow-sm group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:scale-110 group-[.toast]:font-semibold group-[.toast]:rounded-md group-[.toast]:p-1 group-[.toast]:ml-auto group-[.toast]:flex-shrink-0 dark:group-[.toast]:text-blue-300 dark:group-[.toast]:hover:text-blue-200 dark:group-[.toast]:border-blue-700 dark:group-[.toast]:hover:border-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
