package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.CreateRuleDTO;
import com.forum.forum_backend.dto.RuleDTO;
import com.forum.forum_backend.dto.UpdateRuleDTO;
import com.forum.forum_backend.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RuleController {
    private final RuleService ruleService;
    @PostMapping("/rules")
    public ResponseEntity<String> createRule(@RequestBody CreateRuleDTO createRuleDTO){
        return ResponseEntity.ok(ruleService.addRule(createRuleDTO));
    }
    @GetMapping("/rules")
    public ResponseEntity<List<RuleDTO>> getAllRules(){
        return ResponseEntity.ok(ruleService.getAllRules());
    }
    @DeleteMapping("/rules/{id}")
    public ResponseEntity<String> deleteRule(@PathVariable int id){
        return ResponseEntity.ok(ruleService.deleteRule(id));
    }
    @PatchMapping("/rules")
    public ResponseEntity<String> updateRules(@RequestBody UpdateRuleDTO ruleDTO){
        return ResponseEntity.ok(ruleService.updateRule(ruleDTO));
    }
}
