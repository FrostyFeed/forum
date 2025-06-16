package com.forum.forum_backend.utility;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StringUtill {
    public List<String> extractImgs(String content){
        List<String> links = new ArrayList<>();
        Pattern pattern = Pattern.compile("src=\"(.*?)\"");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            links.add(matcher.group(1));  // group(1) contains the URL inside src=""
        }
        return links.stream().distinct().toList();
    }
}
