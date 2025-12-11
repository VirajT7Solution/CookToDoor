package com.platemate.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "payments")
public class RazorpayProperties {

    private RazorpayConfig razorpay = new RazorpayConfig();
    private RazorpayXConfig razorpayx = new RazorpayXConfig();

    public RazorpayConfig getRazorpay() {
        return razorpay;
    }

    public void setRazorpay(RazorpayConfig razorpay) {
        this.razorpay = razorpay;
    }

    public RazorpayXConfig getRazorpayx() {
        return razorpayx;
    }

    public void setRazorpayx(RazorpayXConfig razorpayx) {
        this.razorpayx = razorpayx;
    }

    public static class RazorpayConfig {
        private String keyId;
        private String keySecret;
        private String webhookSecret;
        private String currency = "INR";

        public String getKeyId() {
            return keyId;
        }

        public void setKeyId(String keyId) {
            this.keyId = keyId;
        }

        public String getKeySecret() {
            return keySecret;
        }

        public void setKeySecret(String keySecret) {
            this.keySecret = keySecret;
        }

        public String getWebhookSecret() {
            return webhookSecret;
        }

        public void setWebhookSecret(String webhookSecret) {
            this.webhookSecret = webhookSecret;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }

    public static class RazorpayXConfig {
        private String keyId;
        private String keySecret;
        private String webhookSecret;

        public String getKeyId() {
            return keyId;
        }

        public void setKeyId(String keyId) {
            this.keyId = keyId;
        }

        public String getKeySecret() {
            return keySecret;
        }

        public void setKeySecret(String keySecret) {
            this.keySecret = keySecret;
        }

        public String getWebhookSecret() {
            return webhookSecret;
        }

        public void setWebhookSecret(String webhookSecret) {
            this.webhookSecret = webhookSecret;
        }
    }
}


