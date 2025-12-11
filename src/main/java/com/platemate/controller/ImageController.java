package com.platemate.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.platemate.enums.ImageType;
import com.platemate.model.Image;
import com.platemate.service.ImageService;
import com.platemate.utils.ImageResponse;

@RestController
@RequestMapping("/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(value = "/upload/{imageType}/{ownerId}",
             consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Image> uploadImage(
            @RequestParam("file") MultipartFile file,
            @PathVariable("imageType") ImageType imageType,
            @PathVariable("ownerId") Long ownerId) throws Exception {
        return ResponseEntity.ok(imageService.saveImage(file, imageType, ownerId));
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<byte[]> viewImage(@PathVariable Long id) {
        ImageResponse imageResponse = imageService.getImage(id);
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(imageResponse.getFileType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(imageResponse.getData());
    }
}