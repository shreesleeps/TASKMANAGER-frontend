import { cn } from "@/lib/utils";
import {
  MdAccountCircle,
  MdNotifications,
  MdOutlineAccountCircle,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  return (
    <div className="flex shrink-0 flex-row items-center w-full h-max justify-between px-4 py-3 border-b dark:bg-slate-800 dark:border-slate-700">
      <div className="shrink-0"></div>
      <div className="flex-grow h-full flex flex-row justify-end items-center gap-2">
        {/* <Button
          onClick={() => {}}
          className="rounded-md w-8 h-8"
          variant="outline"
          size="icon"
        >
          <MdOutlineNotificationsActive
            className={cn(
              "h-4 w-4 transition-transform ease-in-out duration-700"
            )}
          />
        </Button> */}

        <Sheet>
          <SheetTrigger>
            <Button
              onClick={() => {}}
              className="rounded-md w-8 h-8"
              variant="outline"
              size="icon"
            >
              <MdOutlineAccountCircle
                className={cn(
                  "h-4 w-4 transition-transform ease-in-out duration-700"
                )}
              />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Profile</SheetTitle>
              <SheetDescription className="flex flex-col w-full gap-2">
                <p className="text-xs font-medium text-muted-foreground shrink-0">
                  {localStorage ? localStorage.getItem("email") : "Guest"}
                </p>
                <p className="text-xs font-medium text-muted-foreground shrink-0">
                  {localStorage
                    ? localStorage.getItem("firstName") +
                      " " +
                      localStorage.getItem("lastName")
                    : "Guest"}
                </p>
                <p className="text-xs font-medium text-muted-foreground shrink-0">
                  {localStorage ? localStorage.getItem("role") : "USER"}
                </p>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <p className="text-xs font-medium text-muted-foreground shrink-0">
          {localStorage ? localStorage.getItem("email") : "Guest"}
        </p>
      </div>
    </div>
  );
}
