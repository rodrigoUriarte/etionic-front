import http from "../config.js";

class ItemDataService {
  index() {
    return http.get("/items");
  }

  show(id) {
    return http.get(`/items/${id}`);
  }

  store(data) {
    return http.post("/items", data);
  }

  update(id, data) {
    return http.put(`/items/${id}`, data);
  }

  destroy(id) {
    return http.delete(`/items/${id}`);
  }
  
}

export default new ItemDataService();