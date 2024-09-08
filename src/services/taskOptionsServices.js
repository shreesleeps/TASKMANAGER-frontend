import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
console.log(API_URL);

export const getAllStatusOptions = async () => {
  try {
    const response = await axios({
      url: `${API_URL}/status`,
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
      "getAllStatusOptions",
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

export const createStatusOption = async ({ label, type, hexColor }) => {
  try {
    const response = await axios({
      url: `${API_URL}/status`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        label,
        type,
        hexColor,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "createStatusOption",
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

export const getAllTypeOptions = async () => {
  try {
    const response = await axios({
      url: `${API_URL}/type`,
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
      "getAllTypeOptions",
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

export const createTypeOption = async ({ label }) => {
  try {
    const response = await axios({
      url: `${API_URL}/type`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        label,
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "createTypeOption",
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
