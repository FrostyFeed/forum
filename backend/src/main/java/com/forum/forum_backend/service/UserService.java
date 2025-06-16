package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.entity.Reply;
import com.forum.forum_backend.entity.Roles;
import com.forum.forum_backend.entity.Threads;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.exeptions.InvalidCredentialsException;
import com.forum.forum_backend.exeptions.UserAlreadyVerifiedException;
import com.forum.forum_backend.exeptions.UserNotFoundException;
import com.forum.forum_backend.repository.RepliesRepository;
import com.forum.forum_backend.repository.ThreadRepository;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RepliesRepository replyService;
    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final RepliesRepository repliesRepository;
    private final EmailService emailService;
    private final JWTUtility jwtUtility;
    private final CloudStorageService cloudStorageService;
    private final PasswordEncoder passwordEncoder;
    private final CookieUtilityService cookieUtilityService;
    private final PostStatsService postStatsService;

    public List<LatestActivityDTO> getLatestActivity(int id){
        List<Reply> replies = replyService.findByUserId(id);
        List<Threads> threads = threadRepository.findByUserId(id);
        List<LatestActivityDTO> latestActivityDAOS= new ArrayList<>();
        replies.forEach(reply -> latestActivityDAOS.add(reply.toLatestActivityDTO()));
        threads.forEach(threads1 -> latestActivityDAOS.add(threads1.toLatestActivityDTO()));
        return latestActivityDAOS.stream().sorted(Comparator.comparing(LatestActivityDTO::creationDate).reversed()).limit(20).toList();
    }
    public String registerUser(RegisterRequestDTO requestDAO){
        String avatarUrl = "Default";
        requestDAO.setPassword(passwordEncoder.encode(requestDAO.getConfirmPassword()));
        User user = new User(requestDAO,avatarUrl,"User");
        userRepository.save(user);
        String token = jwtUtility.generateToken(user.getEmail());
        emailService.sendVerificationEmail(user.getEmail(),token);
        return "OK";
    }
    public String getEmailFromToken(String token){
        return jwtUtility.extractEmail(token);
    }
    public String verifyUser(TokenDTO tokenDAO){
        String email = jwtUtility.extractEmail(tokenDAO.token());
        User user = userRepository.getUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Користувача з електронною поштою: " + email + " не знайдено"));

        if (user.getStatus() == Status.VERIFIED) {
            throw new UserAlreadyVerifiedException("Цей обліковий запис уже підтверджено.");
        }

        user.setStatus(Status.VERIFIED);
        userRepository.save(user);
        return "Електронну пошту успішно підтверджено! Тепер ви маєте повний доступ до DarkForum.";
    }
    public Set<Roles> getUserRoles(String email) {
        User user = userRepository.getUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Користувача з електронною поштою " + email + " не знайдено"));
        return user.getRoles();
    }
    public User loginUser(LoginRequestDTO loginRequestDAO){
        User user = userRepository.getUserByEmail(loginRequestDAO.email()).orElseThrow(InvalidCredentialsException::new);
        if(!passwordEncoder.matches(loginRequestDAO.password(),user.getPassword())){
            throw new InvalidCredentialsException();
        }else{
            user.setLastSeen(OffsetDateTime.now());
            return user;
        }
    }
    public Optional<User> getUserByEmail(String email){
        return Optional.ofNullable(userRepository.getUserByEmail(email).orElseThrow(InvalidCredentialsException::new));
    }
    public UserDataDTO getUserInfo(int id){
        return  userRepository.findUserDataDtoById(id);
    }
    public void saveUser(User user){
        userRepository.save(user);
    }
    public String updateNickname(NicknamePatchRequestDTO requestDTO){
        User user = userRepository.getUserById(requestDTO.id())
                .orElseThrow(() -> new UserNotFoundException("Неможливо оновити нікнейм. Користувача з ID: " + requestDTO.id() + " не знайдено"));
        user.setUsername(requestDTO.nickname());
        userRepository.save(user);
        return "OK";
    }

    public AvatarChangeResponseDTO updateAvatar(AvatarChangeRequestDTO requestDTO) {
        User user = userRepository.getUserById(requestDTO.id())
                .orElseThrow(() -> new UserNotFoundException("Неможливо оновити аватар. Користувача з ID: " + requestDTO.id() + " не знайдено"));

        String newAvatarUrl = cloudStorageService.upload(requestDTO.newAvatar());

        String oldAvatarUrl = user.getAvatarUrl();

        // 3. Update the user entity and save.
        user.setAvatarUrl(newAvatarUrl);
        userRepository.save(user);

        if (oldAvatarUrl != null && !oldAvatarUrl.equals(newAvatarUrl)) {
            cloudStorageService.deleteImg(oldAvatarUrl);
        }

        return new AvatarChangeResponseDTO(newAvatarUrl);
    }

    public String sendPasswordRestLink(PasswordResetRequestDTO requestDTO) {
        User user = userRepository.getUserByEmail(requestDTO.email()).
                orElseThrow(() -> new UserNotFoundException("Користувача не знайдено"));
        emailService.sendPasswordRestEmail(user.getEmail(), jwtUtility.generateToken(user));
        return "OK";
    }

    public String updatePassword(ChangePasswordRequestDTO requestDTO) {
        String email = jwtUtility.extractEmail(requestDTO.jwt());
        userRepository.changeUserPassword(email,passwordEncoder.encode(requestDTO.password()));
        return "OK";
    }

    public String deleteUser(DeleteUserRequestDTO requestDTO, HttpServletRequest request) {
        String jwt = cookieUtilityService.extractJwt(request);
        String email = jwtUtility.extractEmail(jwt);
        User user = userRepository.getUserByEmail(email).orElse(null);
        User deleteUser = userRepository.getDeleteUser(24);
        Optional<List<Threads>> userThreads = Optional.ofNullable(user.getThreads());
        Optional<List<Reply>> userReplies = Optional.ofNullable(user.getReplies());
        DeleteUserRequestDTO deleteUserRequestDTO = userRepository.getUserPasswordByEmail(email, DeleteUserRequestDTO.class);
        if(passwordEncoder.matches(requestDTO.password(),deleteUserRequestDTO.password())){
            userThreads.ifPresent(threads -> threads.forEach(t -> threadRepository.updateUser(deleteUser, t.getId())));
            userReplies.ifPresent(replies -> replies.forEach(r -> repliesRepository.updateUser(deleteUser,r.getId())));
            cloudStorageService.deleteImg(user.getAvatarUrl());
            userRepository.deleteByEmail(email);
        }
        return "OK";
    }

    public User getReferenceById(int i) {
        return userRepository.getReferenceById(i);
    }

    public void updateUserStatus(Status status, int i) {
        userRepository.updateUserStatus(status,i);
    }

    public List<BestScoreEverDTO> findTop10ByReputationNotZero(PageRequest of) {
        return userRepository.findTop10ByReputationNotZero(of);
    }

    public void decreaseUserReputation(int id) {
        userRepository.decreaseUserReputation(id);
    }

    public void increaseUserReputation(int id) {
        userRepository.increaseUserReputation(id);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public int getUserId(String email) {
        return userRepository.getUserId(email);
    }

    public Optional<User> getUserById(int i) {
        return userRepository.getUserById(i);
    }
}
