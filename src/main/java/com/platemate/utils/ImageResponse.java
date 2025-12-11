package com.platemate.utils;

public class ImageResponse {
    private String fileType;
    private byte[] data;

    public ImageResponse(String fileType, byte[] data) {
        this.fileType = fileType;
        this.data = data;
    }

    public String getFileType() {
        return fileType;
    }

    public byte[] getData() {
        return data;
    }
}