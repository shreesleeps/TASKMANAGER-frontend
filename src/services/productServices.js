import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
console.log(API_URL);

export const createProduct = async ({ title, description, teamId }) => {
  try {
    const response = await axios({
      url: `${API_URL}/products`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        teamId: teamId,
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

export const getProduct = async ({ id }) => {
  try {
    const response = await axios({
      url: `${API_URL}/product/${id}`,
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
      "getProducts",
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

export const getProductOptions = async ({ id }) => {
  try {
    const response = await axios({
      url: `${API_URL}/productOptions/${id}`,
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
      "getProducts",
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

export const updateProduct = async ({ id, title, description }) => {
  try {
    const response = await axios({
      url: `${API_URL}/product/${id}`,
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
      "updateProduct",
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
