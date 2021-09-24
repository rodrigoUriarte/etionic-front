import axios from "axios";

export default axios.create({
  baseURL: "http://etionic-back.test/api",
  headers: {
    "Content-type": "application/json"
  }
});