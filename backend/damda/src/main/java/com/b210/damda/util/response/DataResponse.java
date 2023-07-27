package com.b210.damda.util.response;

public class DataResponse<T> extends CommonResponse{

    public DataResponse(int code, String message){
        super(code, message);
    }

    private T data;
}
