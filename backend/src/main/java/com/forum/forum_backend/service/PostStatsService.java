package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.PostStatsDTO;
import com.forum.forum_backend.entity.Stats;
import com.forum.forum_backend.repository.StatsRepository;
import com.forum.forum_backend.utility.StatsType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PostStatsService {
    private final StatsRepository statsRepository;
    public void increaseCount(String date,StatsType type){
        int rowsAffected = statsRepository.increaseCount(date, type);
        if(rowsAffected != 1){
            Stats postStats = Stats.builder().amount(1).date(date).type(type).build();
            statsRepository.save(postStats);
        }
    }

    public List<PostStatsDTO> getStatsForType(StatsType statsType,String year) {
        List<Stats> list = statsRepository.getStatsForYear(year.concat("%"), statsType.name());
        Locale ukrainian = Locale.forLanguageTag("uk");

        return list.stream().map(p -> new PostStatsDTO(YearMonth.parse(p.getDate()).getMonth().getDisplayName(TextStyle.FULL_STANDALONE, ukrainian),p.getAmount())).toList();
    }

}
