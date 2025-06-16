package com.forum.forum_backend.service;

import com.forum.forum_backend.entity.PublicId;
import com.forum.forum_backend.repository.PublicIdRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicIdService {
    private final PublicIdRepository publicIdRepository;
    public void savePublicId(String url,String publicId) {
        publicIdRepository.save(new PublicId(url,publicId));
    }

    public PublicId getPublicId(String url){
        return publicIdRepository.findById(url).orElseThrow(() ->new EntityNotFoundException("Public id not found"));
    }
    public void deletePublicId(String url){
        if(url!= null){
            publicIdRepository.deleteById(url);
        }
    }
}
