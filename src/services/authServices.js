import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
console.log(API_URL);

export const signUp = async (userData) => {
  try {
    const response = await axios({
      url: `${API_URL}/auth/signup`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: userData,
    });
    return response.data;
  } catch (error) {
    console.log(
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return { message: "failed" };
  }
};

export const logIn = async (userData) => {
  try {
    const response = await axios({
      url: `${API_URL}/auth/login`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: userData,
    });
    return response.data;
  } catch (error) {
    console.log(
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return { message: "failed" };
  }
};

export const validateToken = async () => {
  try {
    const response = await axios({
      url: `${API_URL}/auth/validateToken`,
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
      error?.response?.data?.error || error?.message || "Internal Server Error"
    );
    return { message: "failed" };
  }
};
