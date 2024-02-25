import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessAlert = (message) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const showErrorAlert = (message) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}