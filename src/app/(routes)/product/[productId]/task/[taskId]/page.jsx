"use client";

import { useToast } from "@/hooks/use-toast";
import { getProductOptions } from "@/services/productServices";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { MdAdd, MdChevronLeft } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { createTask, getTask, updateTask } from "@/services/taskServices";
import { useRouter } from "next/navigation";

export default function Task({ params }) {
  const router = useRouter();
  const { productId, taskId } = params;
  const { toast } = useToast();
  const currentUser = localStorage.getItem("id");

  const [data, setData] = useState({});
  const priorityOptions = [null, "Low", "Medium", "High", "Critical", "Urgent"];

  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(null);
  const [statusId, setStatusId] = useState("66dc359799162e47d2fabc87");
  const [taskTypeId, setTaskTypeId] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);
  const [watchers, setWatchers] = useState([]);
  const [assignedBy, setAssignedBy] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const getDetails = async () => {
    const response = await getProductOptions({ id: productId });
    if (response.message !== "success") {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setData(response);
      setAssignedBy(currentUser);
      setWatchers([currentUser]);
    }

    const response2 = await getTask({ id: taskId });
    if (response2.message !== "success") {
      toast({
        title: "Error",
        description: response2.error,
        variant: "destructive",
      });
    } else {
      setLabel(response2.task.title || "");
      setDescription(response2.task.description || "");
      setPriority(response2.task.priority || null);
      setStatusId(response2.task.status || "66dc359799162e47d2fabc87");
      setTaskTypeId(response2.task.type || null);
      setAssignedTo(response2.task.assignedTo || []);
      setWatchers(response2.task.watchers || [currentUser]);
      setAssignedBy(response2.task.assignedBy._id || currentUser);
      setDueDate(response2.task.dueOn || null);
    }
  };

  useEffect(() => {
    getDetails();
  }, [productId]);
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2">
      <div className="flex-grow w-full overflow-auto flex flex-col gap-2">
        <div className="space-y-4 flex flex-col shrink-0">
          <div className="space-y-2 px-1 shrink-0">
            <Label htmlFor="taskLabel">Title</Label>
            <Input
              id="taskLabel"
              type="text"
              placeholder="Task Title"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 px-1 shrink-0">
            <Label htmlFor="taskDescription">Description</Label>
            <Textarea
              id="taskDescription"
              placeholder="Task Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Popover>
                <PopoverTrigger>
                  <Button
                    onClick={() => {}}
                    className="rounded-md w-8 h-8"
                    variant="outline"
                    size="icon"
                  >
                    <MdAdd
                      className={cn(
                        "h-4 w-4 transition-transform ease-in-out duration-700"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-1 max-w-48 max-h-72 overflow-y-auto"
                  align="start"
                >
                  {data?.users?.map((user) => (
                    <Button
                      onClick={() => {
                        if (!assignedTo.includes(user._id)) {
                          setAssignedTo([...assignedTo, user._id]);
                        } else {
                          setAssignedTo(
                            assignedTo.filter((id) => id !== user._id)
                          );
                        }
                      }}
                      variant={
                        assignedTo.includes(user._id) ? "default" : "outline"
                      }
                      className="w-full text-ellipsis line-clamp-1 truncate text-start shrink-0"
                    >
                      {user.firstName + " " + user.lastName}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Label>Assigned To</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              {assignedTo.map((userId) => {
                const user = data?.users?.find((user) => user._id === userId);
                return (
                  <HoverCard>
                    <HoverCardTrigger className="cursor-default">
                      <Badge>{user.firstName + " " + user.lastName}</Badge>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-xs font-medium text-muted-foreground max-w-[248px] truncate">
                          <span className="w-max">Email</span>
                          {" - "}
                          <span className="w-max text-primary">
                            {user.email}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-muted-foreground max-w-[248px] truncate">
                          <span className="w-max">Role</span>
                          {" - "}
                          <span className="w-max text-primary">
                            {user.role}
                          </span>
                        </p>
                        <Button
                          onClick={() =>
                            setAssignedTo(
                              assignedTo.filter((id) => id !== userId)
                            )
                          }
                          variant="destructive"
                          size="sm"
                          className="h-6"
                        >
                          Remove
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Popover>
                <PopoverTrigger>
                  <Button
                    onClick={() => {}}
                    className="rounded-md w-8 h-8"
                    variant="outline"
                    size="icon"
                  >
                    <MdAdd
                      className={cn(
                        "h-4 w-4 transition-transform ease-in-out duration-700"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-1 max-w-48 max-h-72 overflow-y-auto"
                  align="start"
                >
                  {data?.users?.map((user) => (
                    <Button
                      onClick={() => {
                        if (!watchers.includes(user._id)) {
                          setWatchers([...watchers, user._id]);
                        } else {
                          if (user._id === assignedBy) return;
                          setWatchers(watchers.filter((id) => id !== user._id));
                        }
                      }}
                      variant={
                        watchers.includes(user._id) ? "default" : "outline"
                      }
                      className="w-full text-ellipsis line-clamp-1 truncate text-start shrink-0"
                    >
                      {user.firstName + " " + user.lastName}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Label>Watchers</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              {watchers.map((userId) => {
                const user = data?.users?.find((user) => user._id === userId);
                return (
                  <HoverCard>
                    <HoverCardTrigger className="cursor-default">
                      <Badge>{user.firstName + " " + user.lastName}</Badge>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-xs font-medium text-muted-foreground max-w-[248px] truncate">
                          <span className="w-max">Email</span>
                          {" - "}
                          <span className="w-max text-primary">
                            {user.email}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-muted-foreground max-w-[248px] truncate">
                          <span className="w-max">Role</span>
                          {" - "}
                          <span className="w-max text-primary">
                            {user.role}
                          </span>
                        </p>
                        <Button
                          onClick={() =>
                            setWatchers(watchers.filter((id) => id !== userId))
                          }
                          variant="destructive"
                          size="sm"
                          className="h-6"
                        >
                          Remove
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Popover>
                <PopoverTrigger>
                  <Button
                    onClick={() => {}}
                    className="rounded-md w-8 h-8"
                    variant="outline"
                    size="icon"
                  >
                    <MdChevronLeft
                      className={cn(
                        "h-4 w-4 transition-transform ease-in-out duration-700 -rotate-90"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-1 max-w-48 max-h-72 overflow-y-auto"
                  align="start"
                >
                  {priorityOptions.reverse().map((option) => (
                    <Button
                      onClick={() => {
                        setPriority(option);
                      }}
                      variant={"outline"}
                      className={cn(
                        "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0",
                        option === priority ? getPriorityColor(option) : ""
                      )}
                    >
                      {option ? option : "No Priority"}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Label>Priority</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              <Badge
                variant={"outline"}
                className={cn(getPriorityColor(priority))}
              >
                {priority ? priority : "No Priority"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Popover>
                <PopoverTrigger>
                  <Button
                    onClick={() => {}}
                    className="rounded-md w-8 h-8"
                    variant="outline"
                    size="icon"
                  >
                    <MdChevronLeft
                      className={cn(
                        "h-4 w-4 transition-transform ease-in-out duration-700 -rotate-90"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-1 max-w-48 max-h-72 overflow-y-auto"
                  align="start"
                >
                  <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] truncate">
                    NOT STARTED
                  </p>
                  {data?.product?.team?.statusOptions
                    ?.filter((option) => option.type === "NOT_STARTED")
                    .map((option) => (
                      <Button
                        onClick={() => {
                          setStatusId(option._id);
                        }}
                        variant={
                          statusId === option._id ? "default" : "outline"
                        }
                        className={cn(
                          "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                        )}
                      >
                        <div
                          className="w-4 h-4 rounded-sm shrink-0 border border-white"
                          style={{
                            backgroundColor: option.hexColor || "#9CA3AF",
                          }}
                        />
                        <span className="w-max line-clamp-1">
                          {option ? option.label : "INVALID"}
                        </span>
                      </Button>
                    ))}
                  <Separator />
                  <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] truncate">
                    ACTIVE
                  </p>
                  {data?.product?.team?.statusOptions
                    ?.filter((option) => option.type === "ACTIVE")
                    .map((option) => (
                      <Button
                        onClick={() => {
                          setStatusId(option._id);
                        }}
                        variant={
                          statusId === option._id ? "default" : "outline"
                        }
                        className={cn(
                          "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                        )}
                      >
                        <div
                          className="w-4 h-4 rounded-sm shrink-0 border border-white"
                          style={{
                            backgroundColor: option.hexColor || "#9CA3AF",
                          }}
                        />
                        <span className="w-max line-clamp-1">
                          {option ? option.label : "INVALID"}
                        </span>
                      </Button>
                    ))}
                  <Separator />
                  <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] truncate">
                    DONE
                  </p>
                  {data?.product?.team?.statusOptions
                    ?.filter((option) => option.type === "DONE")
                    .map((option) => (
                      <Button
                        onClick={() => {
                          setStatusId(option._id);
                        }}
                        variant={
                          statusId === option._id ? "default" : "outline"
                        }
                        className={cn(
                          "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                        )}
                      >
                        <div
                          className="w-4 h-4 rounded-sm shrink-0 border border-white"
                          style={{
                            backgroundColor: option.hexColor || "#9CA3AF",
                          }}
                        />
                        <span className="w-max line-clamp-1">
                          {option ? option.label : "INVALID"}
                        </span>
                      </Button>
                    ))}
                </PopoverContent>
              </Popover>
              <Label>Status</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              <Badge
                variant={"outline"}
                className={cn("flex flex-row items-center gap-1")}
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{
                    backgroundColor: getStatusColor(
                      statusId,
                      data?.product?.team?.statusOptions
                    ),
                  }}
                />
                <span className="w-max">
                  {statusId
                    ? getStatusLabel(
                        statusId,
                        data?.product?.team?.statusOptions
                      )
                    : "No Status"}
                </span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Popover>
                <PopoverTrigger>
                  <Button
                    onClick={() => {}}
                    className="rounded-md w-8 h-8"
                    variant="outline"
                    size="icon"
                  >
                    <MdChevronLeft
                      className={cn(
                        "h-4 w-4 transition-transform ease-in-out duration-700 -rotate-90"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-1 max-w-48 max-h-72 overflow-y-auto"
                  align="start"
                >
                  {data?.product?.team?.typeOptions?.map((option) => (
                    <Button
                      onClick={() => {
                        setTaskTypeId(option._id);
                      }}
                      variant={
                        taskTypeId === option._id ? "default" : "outline"
                      }
                      className={cn(
                        "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0"
                      )}
                    >
                      {option.label || "INVALID"}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Label>Type</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              <Badge variant={taskTypeId ? "default" : "outline"}>
                {taskTypeId
                  ? getTaskTypeLabel(
                      taskTypeId,
                      data?.product?.team?.typeOptions
                    )
                  : "No Type"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 px-1 shrink-0">
            <div className="w-full flex flex-row justify-start gap-2 items-center">
              <Label>Due Date</Label>
            </div>

            <div className="w-full h-max shrink-0 flex-wrap flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? (
                      format(new Date(dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date() - 1000 * 60 * 60 * 24}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-row items-center w-full h-max justify-between pt-3 border-t dark:bg-slate-800 dark:border-slate-700">
        <div className="shrink-0">
          <Button
            onClick={async () => {
              const response = await updateTask({
                id: taskId,
                title: label,
                description: description,
                statusId: statusId,
                typeId: taskTypeId,
                priority: priority,
                dueDate: dueDate,
                watcherIds: watchers,
                assignedToIds: assignedTo,
              });

              if (response.message !== "success") {
                toast({
                  title: "Error",
                  description: response.error,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Success",
                  description: "Task updated successfully",
                  variant: "success",
                });
              }
            }}
          >
            Update Task
          </Button>
        </div>
        <div className="flex-grow h-full flex flex-row justify-end items-center gap-2"></div>
      </div>
    </div>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return cn("bg-[#B0E57C]"); // Light green for Low
    case "Medium":
      return cn("bg-[#F7D154]"); // Yellow for Medium
    case "High":
      return cn("bg-[#FF8C42]"); // Orange for High
    case "Critical":
      return cn("bg-[#FF5C5C] text-[#FFFFFF]"); // Red for Critical
    case "Urgent":
      return cn("bg-[#D32F2F] text-[#FFFFFF]"); // Dark Red for Urgent
    default:
      return cn("bg-[#FFF]"); // Gray for null or unknown priority
  }
};

const getStatusLabel = (statusId, statusOptions) => {
  const status = statusOptions?.find((option) => option._id === statusId);
  return status ? status.label : "No Status";
};

const getStatusColor = (statusId, statusOptions) => {
  const status = statusOptions?.find((option) => option._id === statusId);
  return status ? status.hexColor : "#9CA3AF";
};

const getTaskTypeLabel = (taskId, taskOptions) => {
  const task = taskOptions?.find((option) => option._id === taskId);
  return task ? task.label : "No Task";
};
