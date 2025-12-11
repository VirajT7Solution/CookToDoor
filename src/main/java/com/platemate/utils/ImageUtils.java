package com.platemate.utils;

import java.io.IOException;
import java.util.Base64;
import org.springframework.web.multipart.MultipartFile;

public class ImageUtils {

    // Convert MultipartFile to Base64
    public static String toBase64(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }

    // Convert Base64 back to byte[] (for downloading or serving images)
    public static byte[] fromBase64(String base64Data) {
        return Base64.getDecoder().decode(base64Data);
    }
}
