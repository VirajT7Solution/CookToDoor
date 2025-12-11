package com.platemate.dto;

public class PaymentDtos {

    public static class CreateOrderResponse {
        private String razorpayOrderId;
        private Long amount;
        private String currency;

        public String getRazorpayOrderId() {
            return razorpayOrderId;
        }

        public void setRazorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
        }

        public Long getAmount() {
            return amount;
        }

        public void setAmount(Long amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }
    
    public static class VerifyPaymentRequest {
        private String razorpayPaymentId;
        private String razorpayOrderId;
        private String razorpaySignature;
        
        public String getRazorpayPaymentId() {
            return razorpayPaymentId;
        }
        
        public void setRazorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
        }
        
        public String getRazorpayOrderId() {
            return razorpayOrderId;
        }
        
        public void setRazorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
        }
        
        public String getRazorpaySignature() {
            return razorpaySignature;
        }
        
        public void setRazorpaySignature(String razorpaySignature) {
            this.razorpaySignature = razorpaySignature;
        }
    }
}


