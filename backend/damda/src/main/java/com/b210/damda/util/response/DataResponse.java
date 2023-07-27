package com.b210.damda.util.response;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class DataResponse<T> extends CommonResponse{

    public DataResponse(int code, String message){
        super(code, message);
    }

    private T data;
}
