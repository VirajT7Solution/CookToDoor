package com.platemate.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.platemate.enums.ImageType;
import com.platemate.model.Image;
import com.platemate.repository.ImageRepository;
import com.platemate.utils.ImageResponse;
import com.platemate.utils.ImageUtils;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Image saveImage(MultipartFile file, ImageType imageType, Long ownerId) throws IOException {
        String base64 = ImageUtils.toBase64(file);

        if (imageType == ImageType.CUSTOMER_PROFILE || imageType == ImageType.PROVIDER_PROFILE || 
            imageType == ImageType.DELIVERY_PARTNER_PROFILE || imageType == ImageType.CATEGORY) {
            // Delete all existing images of this type for this owner (handles multiple images case)
            List<Image> existingImages = imageRepository.findAllByImageTypeAndOwnerId(imageType, ownerId);
            for (Image existingImage : existingImages) {
                imageRepository.deleteById(existingImage.getId());
            }
        }

        Image image = new Image(
            file.getOriginalFilename(),
            file.getContentType(),
            base64,
            imageType,
            ownerId
        );

        return imageRepository.save(image);
    }

    public ImageResponse getProviderProfileImage(Long providerId) {
        Long imageId = imageRepository.findIdByImageTypeAndOwnerId(ImageType.PROVIDER_PROFILE, providerId);
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image not found"));
        return new ImageResponse(image.getFileType(), ImageUtils.fromBase64(image.getBase64Data()));
    }

    public ImageResponse getCustomerProfileImage(Long customerId) {
        Long imageId = imageRepository.findIdByImageTypeAndOwnerId(ImageType.CUSTOMER_PROFILE, customerId);
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image not found"));
        return new ImageResponse(image.getFileType(), ImageUtils.fromBase64(image.getBase64Data()));
    }

    // public ImageResponse getCustomerProfileImage(Long providerId) {
    //     Image image = imageRepository.findIdByImageTypeAndOwnerId(ImageType.PROVIDER_PROFILE, providerId).getFirst();
    //     return new ImageResponse(image.getFileType(), ImageUtils.fromBase64(image.getBase64Data()));
    // }

    public ImageResponse getImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return new ImageResponse(
                image.getFileType(),
                ImageUtils.fromBase64(image.getBase64Data())
        );
    }
}

