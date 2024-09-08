"use client";

import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { MdAdd, MdEdit, MdSettings } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./label";
import { Input } from "./input";
import {
  createTeam,
  getTeams,
  updateTaskOptionsForTeam,
  updateTeam,
} from "@/services/teamServices";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { createProduct, updateProduct } from "@/services/productServices";
import {
  createStatusOption,
  createTypeOption,
  getAllStatusOptions,
  getAllTypeOptions,
} from "@/services/taskOptionsServices";
import { Separator } from "@/components/ui/separator";
import { Card } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// No types in JavaScript
export function Menu({ isOpen }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const productIdInPath = pathname.split("/")[2];

  const [sidebarData, setSidebarData] = useState([]);

  const [teamModal, setTeamModal] = useState(false);
  const [teamEditModal, setTeamEditModal] = useState(false);
  const [teamLabel, setTeamLabel] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const [productModal, setProductModal] = useState(false);
  const [productEditModal, setProductEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productLabel, setProductLabel] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [allStatuses, setAllStatuses] = useState([]);
  const [allTypes, setAllTypes] = useState([]);

  const [settingsModal, setSettingsModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [globalSettingsModal, setGlobalSettingsModal] = useState(false);

  const statusTypeOptions = ["NOT_STARTED", "ACTIVE", "DONE"];
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [newStatusType, setNewStatusType] = useState("NOT_STARTED");
  const [newStatusHexColor, setNewStatusHexColor] = useState("#87909E");
  const [newTypeLabel, setNewTypeLabel] = useState("");

  const [accordionValue, setAccordionValue] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  async function getSidebarData() {
    const response = await getTeams();
    if (response.message !== "success") {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setSidebarData(response.teams);
      if (response.teams.length > 0) {
        setAccordionValue(response.teams[0]._id);
        if (
          response.teams[0].products.length > 0 &&
          pathname.includes("dashboard")
        ) {
          router.push(`product/${response.teams[0].products[0]._id}`);
        }
      }
    }
  }

  const getAllTaskOptions = async () => {
    const response = await getAllStatusOptions();
    if (response.message !== "success") {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setAllStatuses(response.status);
    }
    const response2 = await getAllTypeOptions();
    if (response2.message !== "success") {
      toast({
        title: "Error",
        description: response2.error,
        variant: "destructive",
      });
    } else {
      setAllTypes(response2.type);
    }
  };

  useEffect(() => {
    getSidebarData();
    getAllTaskOptions();
  }, []);

  useEffect(() => {
    if (pathname.includes("dashboard")) {
      getSidebarData();
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "mt-8 w-full flex-grow overflow-auto flex flex-col min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2",
        isOpen === false ? "invisible" : ""
      )}
    >
      <div className="w-full h-max shrink-0 flex items-center justify-between pb-2 border-b border-black group">
        <p className="text-sm font-medium text-muted-foreground max-w-[248px] truncate shrink-0">
          Teams
        </p>
        <div className="shrink-0 flex flex-row items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setGlobalSettingsModal(true);
            }}
            className="rounded-md w-6 h-6 invisible group-hover:visible"
            variant="outline"
            size="icon"
          >
            <MdSettings
              className={cn(
                "h-4 w-4 transition-transform ease-in-out duration-700"
              )}
            />
          </Button>
          <Button
            onClick={() => {
              setTeamModal(true);
            }}
            className="rounded-md w-6 h-6 group-hover:visible invisible"
            variant="outline"
            size="icon"
          >
            <MdAdd
              className={cn(
                "h-4 w-4 transition-transform ease-in-out duration-700"
              )}
            />
          </Button>
        </div>
      </div>
      <Dialog
        open={teamEditModal}
        onOpenChange={(open) => {
          if (open === false) {
            setTeamLabel("");
            setTeamDescription("");
            setSelectedTeamId("");
            setSelectedProductId("");
            setProductLabel("");
            setProductDescription("");
          }
          setTeamEditModal(open);
        }}
      >
        <DialogTrigger className="hidden">
          <Button
            onClick={() => {}}
            className="rounded-md w-6 h-6"
            variant="outline"
            size="icon"
          >
            <MdAdd
              className={cn(
                "h-4 w-4 transition-transform ease-in-out duration-700"
              )}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update following details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={teamLabel}
                onChange={(e) => {
                  setTeamLabel(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={teamDescription}
                onChange={(e) => {
                  setTeamDescription(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const response = await updateTeam({
                  id: selectedTeamId,
                  title: teamLabel,
                  description: teamDescription,
                });
                if (response.message === "success") {
                  setTeamLabel("");
                  setTeamDescription("");
                  setSelectedTeamId("");
                  toast({
                    title: "Success!",
                    description: "Team updated successfully.",
                  });
                  setTeamEditModal(false);
                  getSidebarData();
                } else {
                  toast({
                    variant: "destructive",
                    title: "Failed!",
                    description: response.error || "Internal Server Error",
                  });
                }
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={teamModal}
        onOpenChange={(open) => {
          if (open === false) {
            setTeamLabel("");
            setTeamDescription("");
            setSelectedTeamId("");
            setSelectedProductId("");
            setProductLabel("");
            setProductDescription("");
          }
          setTeamModal(open);
        }}
      >
        <DialogTrigger className="hidden">
          <Button
            onClick={() => {}}
            className="rounded-md w-6 h-6"
            variant="outline"
            size="icon"
          >
            <MdAdd
              className={cn(
                "h-4 w-4 transition-transform ease-in-out duration-700"
              )}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new Team</DialogTitle>
            <DialogDescription>Fill the following details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={teamLabel}
                onChange={(e) => {
                  setTeamLabel(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={teamDescription}
                onChange={(e) => {
                  setTeamDescription(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const response = await createTeam({
                  title: teamLabel,
                  description: teamDescription,
                });
                if (response.message === "success") {
                  setTeamLabel("");
                  setTeamDescription("");
                  toast({
                    title: "Success!",
                    description: "Team created successfully.",
                  });
                  setTeamModal(false);
                  getSidebarData();
                } else {
                  toast({
                    variant: "destructive",
                    title: "Failed!",
                    description: response.error || "Internal Server Error",
                  });
                }
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={productModal}
        onOpenChange={(open) => {
          if (open === false) {
            setTeamLabel("");
            setTeamDescription("");
            setSelectedTeamId("");
            setSelectedProductId("");
            setProductLabel("");
            setProductDescription("");
          }
          setProductModal(open);
        }}
      >
        <DialogTrigger
          className="hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new Product</DialogTitle>
            <DialogDescription>Fill the following details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={productLabel}
                onChange={(e) => {
                  setProductLabel(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={productDescription}
                onChange={(e) => {
                  setProductDescription(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const response = await createProduct({
                  title: productLabel,
                  description: productDescription,
                  teamId: selectedTeamId,
                });
                if (response.message === "success") {
                  setProductLabel("");
                  setProductDescription("");
                  setSelectedTeamId("");
                  toast({
                    title: "Success!",
                    description: "Product created successfully.",
                  });
                  setProductModal(false);
                  getSidebarData();
                } else {
                  toast({
                    variant: "destructive",
                    title: "Failed!",
                    description: response.error || "Internal Server Error",
                  });
                }
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={productEditModal}
        onOpenChange={(open) => {
          if (open === false) {
            setTeamLabel("");
            setTeamDescription("");
            setSelectedTeamId("");
            setSelectedProductId("");
            setProductLabel("");
            setProductDescription("");
          }
          setProductEditModal(open);
        }}
      >
        <DialogTrigger
          className="hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update following details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={productLabel}
                onChange={(e) => {
                  setProductLabel(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={productDescription}
                onChange={(e) => {
                  setProductDescription(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const response = await updateProduct({
                  title: productLabel,
                  description: productDescription,
                  id: selectedProductId,
                });
                if (response.message === "success") {
                  setProductLabel("");
                  setProductDescription("");
                  setSelectedTeamId("");
                  setSelectedProductId("");
                  toast({
                    title: "Success!",
                    description: "Product updated successfully.",
                  });
                  setProductModal(false);
                  getSidebarData();
                } else {
                  toast({
                    variant: "destructive",
                    title: "Failed!",
                    description: response.error || "Internal Server Error",
                  });
                }
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={settingsModal}
        onOpenChange={(open) => {
          if (open === false) {
            setStatusOptions([]);
            setTypeOptions([]);
            setSelectedTeamId("");
          }
          setSettingsModal(open);
        }}
      >
        <DialogTrigger
          className="hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></DialogTrigger>
        <DialogContent className="w-[70vw] max-w-[90vw] h-[60vh] flex flex-col gap-4">
          <DialogHeader className={"h-max"}>
            <DialogTitle>Team Tasks Settings</DialogTitle>
            <DialogDescription>
              Update following options for tasks for corresponding team.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex-grow overflow-auto flex flex-row space-x-4">
            <div className="h-full flex-1 shrink-0 flex flex-col overflow-y-auto gap-2">
              <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] truncate shrink-0">
                NOT STARTED
              </p>
              {allStatuses
                ?.filter((option) => option.type === "NOT_STARTED")
                .map((option) => (
                  <Button
                    onClick={() => {
                      if (statusOptions?.includes(option._id)) {
                        if (option.editable === false) return;
                        setStatusOptions(
                          statusOptions?.filter((item) => item !== option._id)
                        );
                      } else {
                        setStatusOptions([...statusOptions, option._id]);
                      }
                    }}
                    variant={
                      statusOptions?.includes(option._id)
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
                        backgroundColor: option.hexColor || "#9CA3AF",
                      }}
                    />
                    <span className="w-max line-clamp-1">
                      {option ? option.label : "INVALID"}
                    </span>
                  </Button>
                ))}
              <Separator />
              <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-1 truncate shrink-0">
                ACTIVE
              </p>
              {allStatuses
                ?.filter((option) => option.type === "ACTIVE")
                .map((option) => (
                  <Button
                    onClick={() => {
                      if (statusOptions?.includes(option._id)) {
                        if (option.editable === false) return;
                        setStatusOptions(
                          statusOptions?.filter((item) => item !== option._id)
                        );
                      } else {
                        setStatusOptions([...statusOptions, option._id]);
                      }
                    }}
                    variant={
                      statusOptions?.includes(option._id)
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0 flex flex-row justify-start gap-2"
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
              <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-1 truncate shrink-0">
                DONE
              </p>
              {allStatuses
                ?.filter((option) => option.type === "DONE")
                .map((option) => (
                  <Button
                    onClick={() => {
                      if (statusOptions?.includes(option._id)) {
                        if (option.editable === false) return;
                        setStatusOptions(
                          statusOptions?.filter((item) => item !== option._id)
                        );
                      } else {
                        setStatusOptions([...statusOptions, option._id]);
                      }
                    }}
                    variant={
                      statusOptions?.includes(option._id)
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0 flex flex-row justify-start gap-2"
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
            </div>
            <Separator orientation="vertical" className="h-full" />
            <div className="h-full flex-1 shrink-0 flex flex-col overflow-y-auto gap-2">
              {allTypes?.map((option) => (
                <Button
                  onClick={() => {
                    if (typeOptions?.includes(option._id)) {
                      if (option.editable === false) return;
                      setTypeOptions(
                        typeOptions?.filter((item) => item !== option._id)
                      );
                    } else {
                      setTypeOptions([...typeOptions, option._id]);
                    }
                  }}
                  variant={
                    typeOptions?.includes(option._id) ? "default" : "outline"
                  }
                  className={cn(
                    "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0"
                  )}
                >
                  {option.label || "INVALID"}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const response = await updateTaskOptionsForTeam({
                  id: selectedTeamId,
                  statusOptions: statusOptions,
                  typeOptions: typeOptions,
                });
                if (response.message === "success") {
                  setSelectedTeamId("");
                  setStatusOptions([]);
                  setTypeOptions([]);
                  toast({
                    title: "Success!",
                    description: "Task Options updated successfully.",
                  });
                  router.replace("/dashboard");
                  setSettingsModal(false);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Failed!",
                    description: response.error || "Internal Server Error",
                  });
                }
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={globalSettingsModal}
        onOpenChange={(open) => {
          if (open === false) {
            setNewStatusHexColor("#87909E");
            setNewStatusLabel("");
            setNewStatusType("NOT_STARTED");
            setNewTypeLabel("");
          }
          setGlobalSettingsModal(open);
        }}
      >
        <DialogTrigger
          className="hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></DialogTrigger>
        <DialogContent className="w-[70vw] max-w-[90vw] h-[60vh] flex flex-col gap-4">
          <DialogHeader className={"h-max"}>
            <DialogTitle>Available Task Options accross Teams</DialogTitle>
            <DialogDescription>
              Configure availabel options for task configuration across all
              teams
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex-grow overflow-auto flex flex-row space-x-4">
            <div className="h-full flex-1 shrink-0 flex flex-col gap-2">
              <div className="flex-grow overflow-auto w-full flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] truncate shrink-0">
                  NOT STARTED
                </p>
                {allStatuses
                  ?.filter((option) => option.type === "NOT_STARTED")
                  .map((option) => (
                    <Button
                      onClick={() => {}}
                      variant={
                        statusOptions?.includes(option._id)
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0 flex flex-row justify-start gap-2"
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
                <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-1 truncate shrink-0">
                  ACTIVE
                </p>
                {allStatuses
                  ?.filter((option) => option.type === "ACTIVE")
                  .map((option) => (
                    <Button
                      onClick={() => {}}
                      variant={
                        statusOptions?.includes(option._id)
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0 flex flex-row justify-start gap-2"
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
                <p className="text-[10px] font-medium text-muted-foreground max-w-[248px] mt-1 truncate shrink-0">
                  DONE
                </p>
                {allStatuses
                  ?.filter((option) => option.type === "DONE")
                  .map((option) => (
                    <Button
                      onClick={() => {}}
                      variant={
                        statusOptions?.includes(option._id)
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0 flex flex-row justify-start gap-2"
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
              </div>
              <div className="shrink-0 w-full h-max flex flex-col gap-1">
                <Card className="w-full h-max shrink-0 flex flex-col gap-1 p-1 border-black">
                  <Input
                    id="status-label"
                    placeholder="Status Label"
                    value={newStatusLabel}
                    onChange={(e) => setNewStatusLabel(e.target.value)}
                  />

                  <div className="shrink-0 w-full h-max flex flex-row gap-1">
                    <div className="flex-1 shrink-0 rounded-md flex flex-row gap-1">
                      <div
                        className="rounded-md w-2 shrink-0 h-full"
                        style={{ backgroundColor: newStatusHexColor }}
                      />
                      <Input
                        id="status-color"
                        placeholder="Status Color (e.g., #FFFFFF)"
                        value={newStatusHexColor}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          if (inputValue && inputValue[0] === "#") {
                            setNewStatusHexColor(inputValue);
                          } else {
                            console.log("Invalid hex color format");
                            toast({
                              title: "Invalid hex color format",
                              description: "Please enter a valid hex color.",
                              variant: "destructive",
                            });
                          }
                        }}
                        maxLength={7}
                      />
                    </div>
                    <div className="flex-1 shrink-0">
                      <Select
                        value={newStatusType}
                        onValueChange={(value) => setNewStatusType(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      const response = await createStatusOption({
                        label: newStatusLabel,
                        hexColor: newStatusHexColor,
                        type: newStatusType,
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
                          description: "Status option created successfully!",
                        });
                        setNewStatusLabel("");
                        setNewStatusHexColor("");
                        setNewStatusType("NOT_STARTED");
                        getAllTaskOptions();
                      }
                    }}
                    className="w-full"
                  >
                    Add Status
                  </Button>
                </Card>
              </div>
            </div>
            <Separator orientation="vertical" className="h-full" />
            <div className="h-full flex-1 shrink-0 flex flex-col gap-2">
              <div className="flex-grow overflow-auto w-full flex flex-col gap-2">
                {allTypes?.map((option) => (
                  <Button
                    onClick={() => {}}
                    variant={
                      typeOptions?.includes(option._id) ? "default" : "outline"
                    }
                    className={cn(
                      "w-full text-ellipsis line-clamp-1 truncate shrink-0 text-start shrink-0"
                    )}
                  >
                    {option.label || "INVALID"}
                  </Button>
                ))}
              </div>
              <div className="shrink-0 w-full h-max flex flex-col gap-1">
                <Card className="w-full h-max shrink-0 flex flex-col gap-1 p-1 border-black">
                  <Input
                    id="status-label"
                    placeholder="Task Type Label"
                    value={newTypeLabel}
                    onChange={(e) => setNewTypeLabel(e.target.value)}
                  />
                  <div className="shrink-0 w-full h-max flex flex-row gap-1">
                    <Button
                      onClick={async () => {
                        const response = await createTypeOption({
                          label: newTypeLabel,
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
                            description: "Task type created successfully!",
                          });
                          setNewTypeLabel("");
                          getAllTaskOptions();
                        }
                      }}
                      className="w-full"
                    >
                      Add Task Type
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full flex-grow overflow-auto flex flex-col">
        <Accordion
          type="single"
          className="w-full flex-col flex gap-2"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          {sidebarData.map((team) => (
            <AccordionItem value={team._id}>
              <AccordionHeader className="border-none group">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAccordionValue(team._id);
                  }}
                  className="w-full justify-start border-none p-0 rounded-sm"
                >
                  <div className="flex flex-row w-full gap-2 px-2 items-center justify-between">
                    <p
                      className={cn(
                        "line-clamp-1",
                        team.products
                          .map((p) => p._id)
                          .includes(productIdInPath) &&
                          "underline underline-offset-2"
                      )}
                    >
                      {team.title}
                    </p>
                    <div className="shrink-0 flex flex-row gap-2 items-center justify-end">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeamId(team._id);
                          setStatusOptions(
                            team.statusOptions.map((s) => s._id)
                          );
                          setTypeOptions(team.typeOptions.map((t) => t._id));
                          setSettingsModal(true);
                        }}
                        className="rounded-md w-6 h-6 invisible group-hover:visible"
                        variant="outline"
                        size="icon"
                      >
                        <MdSettings
                          className={cn(
                            "h-4 w-4 transition-transform ease-in-out duration-700"
                          )}
                        />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeamId(team._id);
                          setTeamLabel(team.title);
                          setTeamDescription(team.description);
                          setTeamEditModal(true);
                        }}
                        className="rounded-md w-6 h-6 invisible group-hover:visible"
                        variant="outline"
                        size="icon"
                      >
                        <MdEdit
                          className={cn(
                            "h-4 w-4 transition-transform ease-in-out duration-700"
                          )}
                        />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeamId(team._id);
                          setProductModal(true);
                        }}
                        className="rounded-md w-6 h-6 invisible group-hover:visible"
                        variant="outline"
                        size="icon"
                      >
                        <MdAdd
                          className={cn(
                            "h-4 w-4 transition-transform ease-in-out duration-700"
                          )}
                        />
                      </Button>
                    </div>
                  </div>
                </Button>
              </AccordionHeader>
              <AccordionContent>
                <div
                  className={cn(
                    "shrink-0 w-full flex flex-col p-2 border rounded-md",
                    team.products.length === 0 && "hidden"
                  )}
                >
                  {team.products.map((product) => (
                    <Button
                      key={product._id}
                      variant="outline"
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                      className="w-full justify-start border-none p-0 rounded-sm group"
                    >
                      <div className="flex flex-row w-full gap-2 px-2 items-center justify-between">
                        <p
                          className={cn(
                            "line-clamp-1",
                            product._id === productIdInPath &&
                              "underline underline-offset-2"
                          )}
                        >
                          {product.title}
                        </p>
                        <div className="shrink-0 flex flex-row gap-2 items-center justify-end">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductId(product._id);
                              setProductLabel(product.title);
                              setProductDescription(product.description);
                              setProductEditModal(true);
                            }}
                            className="rounded-md w-6 h-6 invisible group-hover:visible"
                            variant="outline"
                            size="icon"
                          >
                            <MdEdit
                              className={cn(
                                "h-4 w-4 transition-transform ease-in-out duration-700"
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="shrink-0 w-2 h-screen"></div>
      </div>

      <div className="w-full flex items-end shrink-0">
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  handleLogout();
                }}
                variant="outline"
                className="w-full justify-start h-10 mt-5"
              >
                <span className={cn(isOpen === false ? "" : "mr-4")}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    "whitespace-nowrap",
                    isOpen === false ? "opacity-0 hidden" : "opacity-100"
                  )}
                >
                  Sign out
                </p>
              </Button>
            </TooltipTrigger>
            {isOpen === false && (
              <TooltipContent side="right">Sign out</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
