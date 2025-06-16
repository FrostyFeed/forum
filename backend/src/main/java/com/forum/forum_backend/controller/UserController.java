package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.entity.Roles;
import com.forum.forum_backend.service.UserService;
import com.forum.forum_backend.utility.CloudStorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE,RequestMethod.PATCH})
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final CloudStorageService cloudStorageService;
    @GetMapping("/user/{id}/latest")
    public ResponseEntity<List<LatestActivityDTO>> getLatestActivity(@PathVariable int id){
        return ResponseEntity.ok(userService.getLatestActivity(id));
    }
    @PostMapping("/user/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequestDTO registerRequestDAO){
        return ResponseEntity.ok(userService.registerUser(registerRequestDAO));
    }
    @PostMapping("/user/avatar")
    public ResponseEntity<?> setAndUploadAvatar(@ModelAttribute UploadAvatarDTO uploadAvatarDTO){
        try{
            cloudStorageService.upload(uploadAvatarDTO.email(), uploadAvatarDTO.avatar().getBytes());
        }catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reading file before processing.");
        }
        return ResponseEntity.accepted().body("Uploading avatar");
    }
    @GetMapping("/user/email/{token}")
    public ResponseEntity<String> getEmailFromToken(@PathVariable String token){
        return ResponseEntity.ok(userService.getEmailFromToken(token));
    }
    @PostMapping("/user/verification")
    public ResponseEntity<String> verifyUser(@RequestBody @Valid TokenDTO token){
        return ResponseEntity.ok(userService.verifyUser(token));
    }
    @GetMapping("/user/roles/{email}")
    public ResponseEntity<Set<Roles>> getUserRoles(@PathVariable String email){
        return ResponseEntity.ok(userService.getUserRoles(email));
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDataDTO> getUserInfo(@PathVariable int id){
        return ResponseEntity.ok(userService.getUserInfo(id));
    }
    @PatchMapping("/user/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody NicknamePatchRequestDTO requestDTO){
        return ResponseEntity.ok(userService.updateNickname(requestDTO));
    }
    @PatchMapping("/user/avatar")
    public ResponseEntity<AvatarChangeResponseDTO> updateAvatar(@ModelAttribute AvatarChangeRequestDTO requestDTO){
        return ResponseEntity.ok(userService.updateAvatar(requestDTO));
    }
    @PostMapping("/user/password-reset-request")
    public ResponseEntity<String> sendPasswordResetLink(@RequestBody PasswordResetRequestDTO requestDTO){
        return ResponseEntity.ok(userService.sendPasswordRestLink(requestDTO));
    }
    @PatchMapping("/user/password-reset")
    public ResponseEntity<String> updateUserPassword(@RequestBody @Valid ChangePasswordRequestDTO requestDTO){
        return ResponseEntity.ok(userService.updatePassword(requestDTO));
    }
    @DeleteMapping("/user")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteUserRequestDTO requestDTO, HttpServletRequest request){
        return ResponseEntity.ok(userService.deleteUser(requestDTO,request));
    }



}
