package com.platemate.dto;

public class CategoryDtos {

    public static class CreateRequest {
        private String categoryName;
        private String description;
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class UpdateRequest {
        private String categoryName;
        private String description;
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class Response {
        private Long id;
        private String categoryName;
        private String description;
        private String imageBase64;
        private String imageFileType;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getImageBase64() { return imageBase64; }
        public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
        public String getImageFileType() { return imageFileType; }
        public void setImageFileType(String imageFileType) { this.imageFileType = imageFileType; }
    }
}


