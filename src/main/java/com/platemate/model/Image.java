package com.platemate.model;

import com.platemate.enums.ImageType;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image extends BaseEntity {

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column(columnDefinition = "TEXT")
    private String base64Data;

    @Enumerated(EnumType.STRING)
    @Column(name = "image_type", nullable = false)
    private ImageType imageType;  // PROFILE / PRODUCT / PLACE / DL

    // this helps us link image to any entity
    @Column(name = "owner_id")
    private Long ownerId;

    public Image() {
    }

    public Image(String fileName, String fileType, String base64Data, ImageType imageType, Long ownerId) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.base64Data = base64Data;
        this.imageType = imageType;
        this.ownerId = ownerId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getBase64Data() {
        return base64Data;
    }

    public void setBase64Data(String base64Data) {
        this.base64Data = base64Data;
    }

    public ImageType getImageType() {
        return imageType;
    }

    public void setImageType(ImageType imageType) {
        this.imageType = imageType;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    
}