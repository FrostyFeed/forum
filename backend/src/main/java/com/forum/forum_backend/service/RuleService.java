package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.CreateRuleDTO;
import com.forum.forum_backend.dto.RuleDTO;
import com.forum.forum_backend.dto.UpdateRuleDTO;
import com.forum.forum_backend.entity.Rule;
import com.forum.forum_backend.repository.RuleRepository;
import com.forum.forum_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RuleService {
    private final RuleRepository ruleRepository;
    private final UserService userService;
    public String addRule(CreateRuleDTO createRuleDTO){
        Rule rule = Rule.builder().text(createRuleDTO.text()).admin(userService.getReferenceById(createRuleDTO.adminId())).build();
        ruleRepository.save(rule);
        return Integer.toString(rule.getId());
    }
    public String deleteRule(int id){
        ruleRepository.deleteById(id);
        return "OK";
    }
    public List<RuleDTO> getAllRules(){
        return ruleRepository.getAll();
    }
    public String updateRule(UpdateRuleDTO ruleDTO){
        ruleRepository.updateTextById(ruleDTO.id(),ruleDTO.text());
        return "OK";
    }
}
