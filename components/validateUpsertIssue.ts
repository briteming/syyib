import { toast } from "react-hot-toast";

export const validateIssueFields = (title: string, body: string): boolean => {
  if (!title.trim() || !body.trim()) {
    let message = "Please enter ";
    if (!title.trim()) {
      message += "title";
    }
    if (!body.trim()) {
      message += (!title.trim() ? " and " : "") + "body";
    }
    toast(message, {
      style: { background: "red", color: "white" },
      position: "top-center",
    });
    return false;
  } else if (body.trim().length < 30) {
    toast("Body should be at least 30 characters long", {
      style: { background: "red", color: "white" },
      position: "top-center",
    });
    return false;
  }
  return true;
};