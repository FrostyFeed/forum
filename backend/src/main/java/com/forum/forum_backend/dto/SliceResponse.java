package com.forum.forum_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Slice;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class SliceResponse<T> {
    private List<T> content;
    private boolean hasNext;
    private boolean isFirst;
    private boolean isLast;
    private int pageNumber;
    private int pageSize;

    public SliceResponse(Slice<T> slice) {
        this.content = slice.getContent();
        this.hasNext = slice.hasNext();
        this.isFirst = slice.isFirst();
        this.isLast = slice.isLast();
        this.pageNumber = slice.getNumber();
        this.pageSize = slice.getSize();
    }

}