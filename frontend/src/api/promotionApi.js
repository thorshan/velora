import apiClient from "./apiClient";

export const promotionApi = {
    getAllPromotions: () => apiClient.get("/promotions"),
    getPromotion: (id) => apiClient.get(`/promotions/${id}`),
    getPromotionByItem: (id) => apiClient.get(`/promotions/${id}`),
    createPromotion: (data) => apiClient.post("/promotions", data),
    updatePromotion: (id, data) => apiClient.put(`/promotions/${id}`, data),
    deletePromotion: (id) => apiClient.delete(`/promotions/${id}`)
}