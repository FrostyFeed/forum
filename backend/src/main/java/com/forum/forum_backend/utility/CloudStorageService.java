package com.forum.forum_backend.utility;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.forum.forum_backend.entity.PublicId;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.service.PublicIdService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.hibernate.boot.model.process.internal.UserTypeResolution;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CloudStorageService {
    private Cloudinary cloudinary;
    private final PublicIdService publicIdService;
    private final UserRepository userRepository;

    @Value("${cloud.name}")
    private String cloudName;

    @Value("${api.key}")
    private String apiKey;

    @Value("${api.secret}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }
    public String upload(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();
            publicIdService.savePublicId(url,publicId);
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }
    @Async
    public void upload(String email,byte[] file){
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();
            publicIdService.savePublicId(url,publicId);
            userRepository.changeAvatarUrl(url,email);
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }
    public void deleteImg(String url){
        PublicId publicId = publicIdService.getPublicId(url);
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId.getPublicId(), ObjectUtils.emptyMap());

            if (!"ok".equals(result.get("result"))) {
                throw new RuntimeException("Delete failed: " + result.get("result"));
            }else{
                publicIdService.deletePublicId(url);
            }
        } catch (IOException e) {
            throw new RuntimeException("Delete failed", e);
        }
    }
}
