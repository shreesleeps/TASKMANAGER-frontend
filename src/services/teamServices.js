import {
  defaultStatusTypeOptionIds,
  defaultTaskTypeOptionIds,
} from "@/lib/defaultData";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
console.log(API_URL);

export const createTeam = async ({ title, description }) => {
  try {
    const response = await axios({
      url: `${API_URL}/teams`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        status: defaultStatusTypeOptionIds,
        type: defaultTaskTypeOptionIds,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "createTeam",
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return {
      message: "failed",
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Internal Server Error",
    };
  }
};

export const getTeams = async () => {
  try {
    const response = await axios({
      url: `${API_URL}/teams`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "getTeams",
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return {
      message: "failed",
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Internal Server Error",
    };
  }
};

export const updateTeam = async ({ id, title, description }) => {
  try {
    const response = await axios({
      url: `${API_URL}/team/${id}`,
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "updateTeam",
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return {
      message: "failed",
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Internal Server Error",
    };
  }
};

export const updateTaskOptionsForTeam = async ({
  id,
  statusOptions,
  typeOptions,
}) => {
  try {
    const response = await axios({
      url: `${API_URL}/team/${id}/taskOptions`,
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        statusOptions: statusOptions,
        typeOptions: typeOptions,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "updateTaskOptionsForTeam",
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return {
      message: "failed",
      error:
        error?.response?.data?.error ||
        error?.message ||
        "Internal Server Error",
    };
  }
};
