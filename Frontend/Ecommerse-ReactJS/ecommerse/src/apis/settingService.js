import axiosClient from "./axiosClient";

const getSettings = () => {
    return axiosClient.get("/settings");
};

export { getSettings };
