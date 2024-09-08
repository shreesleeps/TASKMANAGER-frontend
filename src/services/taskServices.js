import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
console.log(API_URL);

export const createTask = async ({
  title,
  description,
  priority,
  productId,
  teamId,
  assignedById,
  assignedToIds,
  watcherIds,
  statusId,
  typeId,
  dueOn,
}) => {
  try {
    const response = await axios({
      url: `${API_URL}/task`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        priority,
        productId,
        teamId,
        assignedById,
        assignedToIds,
        watcherIds,
        statusId,
        typeId,
        dueOn,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "createTask",
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

export const updateStatusForTask = async ({ statusId, taskId }) => {
  try {
    const response = await axios({
      url: `${API_URL}/task/${taskId}/status/${statusId}`,
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "updateStatusForTask",
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

export const getTask = async ({ id }) => {
  try {
    const response = await axios({
      url: `${API_URL}/task/${id}`,
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
      "getTask",
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

export const updateTask = async ({
  id,
  title,
  description,
  priority,
  assignedToIds,
  watcherIds,
  statusId,
  typeId,
  dueDate,
}) => {
  try {
    const response = await axios({
      url: `${API_URL}/task/${id}`,
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedToIds,
        watcherIds,
        statusId,
        typeId,
        dueDate,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "updateTask",
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
