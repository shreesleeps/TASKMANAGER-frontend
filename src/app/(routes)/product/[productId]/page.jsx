"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getProduct } from "@/services/productServices";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  FilterIcon,
  ListIcon,
  SearchIcon,
  SortAscIcon,
  AlertTriangleIcon,
  UserIcon,
  EyeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateStatusForTask } from "@/services/taskServices";

export default function Product({ params }) {
  const router = useRouter();
  const { productId } = params;
  const { toast } = useToast();

  const [data, setData] = useState({});

  const [taskSearch, setTaskSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  const getProductDetails = async () => {
    const response = await getProduct({ id: productId });
    if (response.message !== "success") {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setData(response);
    }
  };

  const changeStatus = async (statusId, taskId) => {
    const response = await updateStatusForTask({ statusId, taskId });
    if (response.message !== "success") {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      const newTasks = data.tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, status: response.status };
        }
        return task;
      });
      setData({ ...data, tasks: newTasks });
    }
  };

  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    getProductDetails();
  }, [productId]);
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2">
      <div className="flex shrink-0 flex-row items-center w-full h-max justify-between pb-3 border-b dark:bg-slate-800 dark:border-slate-700">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">
            {data?.product?.title || "Tasks"}
          </h1>
        </div>
        <div className="flex-grow h-full flex flex-row justify-end items-center gap-2">
          <Button onClick={() => router.push(`/product/${productId}/task/new`)}>
            Add New Task
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search tasks..."
            icon={<SearchIcon className="h-4 w-4" />}
            onChange={(e) => setTaskSearch(e.target.value)}
            value={taskSearch}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL</SelectItem>
            {data?.product?.team?.statusOptions?.map((status) => (
              <SelectItem key={status._id} value={status._id}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="dueOn">Date Due</SelectItem>
            <SelectItem value="closedOn">Date Close</SelectItem>
          </SelectContent>
        </Select>
        {/* <Button variant="outline" size="icon">
          <ListIcon className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="w-full flex-grow overflow-auto">
        <div className="gap-2 flex flex-col">
          <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-4 truncate">
            NOT STARTED
          </p>
          {data?.tasks
            ?.filter((task) => task.status.type === "NOT_STARTED")
            .filter((task) =>
              taskSearch === ""
                ? true
                : task.title.toLowerCase().includes(taskSearch.toLowerCase())
            )
            .filter((task) =>
              statusFilter === "all" ? true : task.status._id === statusFilter
            )
            .sort((a, b) => {
              if (!a[sortBy]) return 1;
              if (!b[sortBy]) return -1;
              if (a[sortBy] < b[sortBy]) return -1;
              if (a[sortBy] > b[sortBy]) return 1;
              return 0;
            })
            .map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-base font-semibold truncate flex flex-row gap-2 items-center">
                      <Popover>
                        <PopoverTrigger>
                          <Button variant="secondary" size="icon">
                            <div
                              className={cn(
                                "w-4 h-4 shrink-0 rounded-full relative flex justify-center items-center"
                              )}
                              style={{
                                backgroundColor: task.status.hexColor,
                              }}
                            >
                              <div className="w-3 h-3 rounded-full absolute border border-white"></div>
                            </div>
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
                                  }}
                                />
                                <span className="w-max line-clamp-1">
                                  {option ? option.label : "INVALID"}
                                </span>
                              </Button>
                            ))}
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={() => {
                          router.push(`/product/${productId}/task/${task._id}`);
                        }}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {task.title}
                      </Button>
                    </span>
                    <Badge
                      variant={"outline"}
                      className={cn(getPriorityColor(task.priority))}
                    >
                      {task.priority ? task.priority : "No Priority"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="flex flex-col gap-2">
                  <div className="w-full flex flex-row items-center justify-between gap-1 text-xs">
                    <div className="flex flex-row items-center justify-start gap-1">
                      <span className="font-medium">Type:</span>
                      <span>{task.type?.label || "Not specified"}</span>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-4 h-4">
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Created:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.createdAt)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Due:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.dueOn)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Closed:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.closedOn)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap gap-2 text-xs">
                    <span className="font-medium">Assigned To:</span>
                    {task.assignedTo?.map((id, ind) => (
                      <>
                        <span>
                          {getUserName(id, data?.users)}
                          {task.assignedTo.length > 1 &&
                          ind !== task.assignedTo.length - 1
                            ? ","
                            : ""}
                          {ind === task.assignedTo.length - 1 ? "." : ""}
                        </span>
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-4 truncate">
            ACTIVE
          </p>
          {data?.tasks
            ?.filter((task) => task.status.type === "ACTIVE")
            .filter((task) =>
              taskSearch === ""
                ? true
                : task.title.toLowerCase().includes(taskSearch.toLowerCase())
            )
            .filter((task) =>
              statusFilter === "all" ? true : task.status._id === statusFilter
            )
            .sort((a, b) => {
              if (!a[sortBy]) return 1;
              if (!b[sortBy]) return -1;
              if (a[sortBy] < b[sortBy]) return -1;
              if (a[sortBy] > b[sortBy]) return 1;
              return 0;
            })
            .map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-base font-semibold truncate flex flex-row gap-2 items-center">
                      <Popover>
                        <PopoverTrigger>
                          <Button variant="secondary" size="icon">
                            <div
                              className={cn(
                                "w-4 h-4 shrink-0 rounded-full relative flex justify-center items-center"
                              )}
                              style={{
                                backgroundColor: task.status.hexColor,
                              }}
                            >
                              <div className="w-3 h-3 rounded-full absolute border border-white"></div>
                            </div>
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
                                  }}
                                />
                                <span className="w-max line-clamp-1">
                                  {option ? option.label : "INVALID"}
                                </span>
                              </Button>
                            ))}
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={() => {
                          router.push(`/product/${productId}/task/${task._id}`);
                        }}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {task.title}
                      </Button>
                    </span>
                    <Badge
                      variant={"outline"}
                      className={cn(getPriorityColor(task.priority))}
                    >
                      {task.priority ? task.priority : "No Priority"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="flex flex-col gap-2">
                  <div className="w-full flex flex-row items-center justify-between gap-1 text-xs">
                    <div className="flex flex-row items-center justify-start gap-1">
                      <span className="font-medium">Type:</span>
                      <span>{task.type?.label || "Not specified"}</span>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-4 h-4">
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Created:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.createdAt)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Due:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.dueOn)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Closed:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.closedOn)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap gap-2 text-xs">
                    <span className="font-medium">Assigned To:</span>
                    {task.assignedTo?.map((id, ind) => (
                      <>
                        <span>
                          {getUserName(id, data?.users)}
                          {task.assignedTo.length > 1 &&
                          ind !== task.assignedTo.length - 1
                            ? ","
                            : ""}
                          {ind === task.assignedTo.length - 1 ? "." : ""}
                        </span>
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-4 truncate">
            DONE
          </p>
          {data?.tasks
            ?.filter((task) => task.status.type === "DONE")
            .filter((task) =>
              taskSearch === ""
                ? true
                : task.title.toLowerCase().includes(taskSearch.toLowerCase())
            )
            .filter((task) =>
              statusFilter === "all" ? true : task.status._id === statusFilter
            )
            .sort((a, b) => {
              if (!a[sortBy]) return 1;
              if (!b[sortBy]) return -1;
              if (a[sortBy] < b[sortBy]) return -1;
              if (a[sortBy] > b[sortBy]) return 1;
              return 0;
            })
            .map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-base font-semibold truncate flex flex-row gap-2 items-center">
                      <Popover>
                        <PopoverTrigger>
                          <Button variant="secondary" size="icon">
                            <div
                              className={cn(
                                "w-4 h-4 shrink-0 rounded-full relative flex justify-center items-center"
                              )}
                              style={{
                                backgroundColor: task.status.hexColor,
                              }}
                            >
                              <div className="w-3 h-3 rounded-full absolute border border-white"></div>
                            </div>
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
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
                                  changeStatus(option._id, task._id);
                                }}
                                variant={
                                  task.status._id === option._id
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "w-full text-ellipsis line-clamp-1 truncate text-start shrink-0 flex flex-row justify-start gap-2"
                                )}
                              >
                                <div
                                  className="w-4 h-4 rounded-sm shrink-0 border border-white"
                                  style={{
                                    backgroundColor:
                                      option.hexColor || "#9CA3AF",
                                  }}
                                />
                                <span className="w-max line-clamp-1">
                                  {option ? option.label : "INVALID"}
                                </span>
                              </Button>
                            ))}
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={() => {
                          router.push(`/product/${productId}/task/${task._id}`);
                        }}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {task.title}
                      </Button>
                    </span>
                    <Badge
                      variant={"outline"}
                      className={cn(getPriorityColor(task.priority))}
                    >
                      {task.priority ? task.priority : "No Priority"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="flex flex-col gap-2">
                  <div className="w-full flex flex-row items-center justify-between gap-1 text-xs">
                    <div className="flex flex-row items-center justify-start gap-1">
                      <span className="font-medium">Type:</span>
                      <span>{task.type?.label || "Not specified"}</span>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-4 h-4">
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Created:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.createdAt)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Due:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.dueOn)}
                        </span>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="flex flex-row gap-1 items-end">
                        <span className="font-medium">Date Closed:</span>
                        <span className="w-[70px] text-center">
                          {getLocaleDate(task.closedOn)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap gap-2 text-xs">
                    <span className="font-medium">Assigned To:</span>
                    {task.assignedTo?.map((id, ind) => (
                      <>
                        <span>
                          {getUserName(id, data?.users)}
                          {task.assignedTo.length > 1 &&
                          ind !== task.assignedTo.length - 1
                            ? ","
                            : ""}
                          {ind === task.assignedTo.length - 1 ? "." : ""}
                        </span>
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

const mockTasks = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Set up JWT-based authentication for the application",
    priority: "High",
    assignedBy: { id: "u1", name: "John Doe" },
    assignedTo: [
      { id: "u2", name: "Jane Smith" },
      { id: "u3", name: "Bob Johnson" },
    ],
    watchers: [
      { id: "u4", name: "Alice Williams" },
      { id: "u5", name: "Charlie Brown" },
    ],
    status: { id: "s1", name: "In Progress" },
    type: { id: "ty1", name: "Feature" },
    dueOn: new Date("2023-06-30"),
    createdAt: new Date("2023-06-01"),
  },
  // ... more mock tasks
];

const priorityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-green-100 text-green-800",
  High: "bg-yellow-100 text-yellow-800",
  Urgent: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const statusOptions = [
  { id: "s1", name: "To Do" },
  { id: "s2", name: "In Progress" },
  { id: "s3", name: "Review" },
  { id: "s4", name: "Done" },
];

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

const getLocaleDate = (date) => {
  if (!date) {
    return "-";
  }
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};

const getUserName = (userId, userOptions) => {
  const user = userOptions?.find((option) => option._id === userId);
  return user ? user.firstName + " " + user.lastName : "Invalid User";
};
