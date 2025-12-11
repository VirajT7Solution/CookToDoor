package com.platemate.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.platemate.enums.PayoutStatus;

public class PayoutDtos {

    public static class StatementRequest {
        private Long providerId;
        private LocalDateTime from;
        private LocalDateTime to;
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public LocalDateTime getFrom() { return from; }
        public void setFrom(LocalDateTime from) { this.from = from; }
        public LocalDateTime getTo() { return to; }
        public void setTo(LocalDateTime to) { this.to = to; }
    }

    public static class StatementResponse {
        private Double gross;
        private Double platformCommission;
        private Double netPayable;
        public Double getGross() { return gross; }
        public void setGross(Double gross) { this.gross = gross; }
        public Double getPlatformCommission() { return platformCommission; }
        public void setPlatformCommission(Double platformCommission) { this.platformCommission = platformCommission; }
        public Double getNetPayable() { return netPayable; }
        public void setNetPayable(Double netPayable) { this.netPayable = netPayable; }
    }

    public static class ProviderPayoutDto {
        private Long providerId;
        private String businessName;
        private Double pendingAmount;
        private LocalDateTime lastPayoutDate;
        
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public Double getPendingAmount() { return pendingAmount; }
        public void setPendingAmount(Double pendingAmount) { this.pendingAmount = pendingAmount; }
        public LocalDateTime getLastPayoutDate() { return lastPayoutDate; }
        public void setLastPayoutDate(LocalDateTime lastPayoutDate) { this.lastPayoutDate = lastPayoutDate; }
    }

    public static class ProviderPayoutDetailsDto {
        private Long providerId;
        private String businessName;
        private Double pendingAmount;
        private Double totalPayouts;
        private List<PayoutHistoryDto> recentTransactions;
        
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public Double getPendingAmount() { return pendingAmount; }
        public void setPendingAmount(Double pendingAmount) { this.pendingAmount = pendingAmount; }
        public Double getTotalPayouts() { return totalPayouts; }
        public void setTotalPayouts(Double totalPayouts) { this.totalPayouts = totalPayouts; }
        public List<PayoutHistoryDto> getRecentTransactions() { return recentTransactions; }
        public void setRecentTransactions(List<PayoutHistoryDto> recentTransactions) { this.recentTransactions = recentTransactions; }
    }

    public static class ProcessPayoutRequest {
        private Double amount;
        private String paymentMethod; // "ONLINE" or "CASH"
        
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class PayoutResponseDto {
        private Long transactionId;
        private Double amount;
        private Double remainingPendingAmount;
        private String razorpayxPayoutId;
        private PayoutStatus status;
        private String paymentMethod; // "ONLINE" or "CASH"
        
        public Long getTransactionId() { return transactionId; }
        public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public Double getRemainingPendingAmount() { return remainingPendingAmount; }
        public void setRemainingPendingAmount(Double remainingPendingAmount) { this.remainingPendingAmount = remainingPendingAmount; }
        public String getRazorpayxPayoutId() { return razorpayxPayoutId; }
        public void setRazorpayxPayoutId(String razorpayxPayoutId) { this.razorpayxPayoutId = razorpayxPayoutId; }
        public PayoutStatus getStatus() { return status; }
        public void setStatus(PayoutStatus status) { this.status = status; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class PayoutHistoryDto {
        private Long transactionId;
        private Long providerId;
        private String businessName; // Provider business name
        private Double amount;
        private PayoutStatus status;
        private LocalDateTime processedAt;
        private String razorpayxPayoutId;
        private Long processedBy;
        private String paymentMethod; // "ONLINE" or "CASH"
        
        public Long getTransactionId() { return transactionId; }
        public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public PayoutStatus getStatus() { return status; }
        public void setStatus(PayoutStatus status) { this.status = status; }
        public LocalDateTime getProcessedAt() { return processedAt; }
        public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
        public String getRazorpayxPayoutId() { return razorpayxPayoutId; }
        public void setRazorpayxPayoutId(String razorpayxPayoutId) { this.razorpayxPayoutId = razorpayxPayoutId; }
        public Long getProcessedBy() { return processedBy; }
        public void setProcessedBy(Long processedBy) { this.processedBy = processedBy; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}
