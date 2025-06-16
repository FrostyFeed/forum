package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.BestScoreEverDTO;
import com.forum.forum_backend.dto.MonthlyScoreDTO;
import com.forum.forum_backend.entity.MonthlyScore;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.repository.MonthlyScoreRepository;
import com.forum.forum_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MonthlyScoreService {
    private final MonthlyScoreRepository monthlyScoreRepository;
    private final UserService userService;
    public void addScore(int userId){
        User user = userService.getReferenceById(userId);
        Optional<MonthlyScore> monthlyScore = monthlyScoreRepository.findUserScoreByYearMonth(user, YearMonth.now().toString());
        if(monthlyScore.isPresent()){
            monthlyScoreRepository.addScore(monthlyScore.get().getId());
        }
        else{
            MonthlyScore newMonthlyScore = MonthlyScore.builder().date(YearMonth.now().toString()).reputation(1).user(user).build();
            monthlyScoreRepository.save(newMonthlyScore);
        }
    }
    public void removeScore(int userId){
        User user = userService.getReferenceById(userId);
        Optional<MonthlyScore> monthlyScore = monthlyScoreRepository.findUserScoreByYearMonth(user, YearMonth.now().toString());
        monthlyScore.ifPresent(score -> monthlyScoreRepository.removeScore(score.getId()));
    }

    public List<MonthlyScoreDTO> getTopScores() {
        List<MonthlyScore> monthlyScoreList  = monthlyScoreRepository.findTop10ByDateOrderByReputationDesc(YearMonth.now().toString());
        return monthlyScoreList.stream().map(a -> new MonthlyScoreDTO(a.getUser().getId(),a.getReputation(),a.getUser().getUsername(),a.getUser().getAvatarUrl())).toList();
    }

    public List<BestScoreEverDTO> getTopScoreEver() {
        return userService.findTop10ByReputationNotZero(PageRequest.of(0,10));
    }
}
