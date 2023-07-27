package com.b210.damda.util.exception;


import com.b210.damda.util.response.CommonResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@Getter
@RestControllerAdvice
@RequiredArgsConstructor
public class ControllerAdvisor {

    @ExceptionHandler(CommonException.class)
    public CommonResponse commonExceptionHandler(CommonException e){

        CommonResponse response = new CommonResponse();
        response.setCode(e.getCustomExceptionStatus().getCode());
        response.setMessage(e.getCustomExceptionStatus().getMessage());

        return response;
    }
}
