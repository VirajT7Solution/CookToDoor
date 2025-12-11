package com.platemate.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "provider_operating_hours")
public class ProviderOperatingHours extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private TiffinProvider provider;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 1 = Monday, ..., 7 = Sunday

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "is_closed", nullable = false)
    private Boolean isClosed = false;

    public ProviderOperatingHours() {}

    public ProviderOperatingHours(TiffinProvider provider, Integer dayOfWeek, LocalTime openTime,
            LocalTime closeTime, Boolean isClosed) {
        this.provider = provider;
        this.dayOfWeek = dayOfWeek;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.isClosed = isClosed;
    }

    public TiffinProvider getProvider() {
        return provider;
    }

    public void setProvider(TiffinProvider provider) {
        this.provider = provider;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }
}

