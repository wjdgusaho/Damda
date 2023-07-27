package com.b210.damda.util.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CustomExceptionStatus {

    /*
       CODE : 카테고리 (4자리 정수)
       MESSAFE : 메세지
     */

    //존재 관련
    THEMA_NOT_FOUND(-6000, "해당 테마가 존재하지 않습니다"),
    ITEM_NOT_FOUND(-6001, "해당 아이템이 존재하지 않습니다"),


    //상점 관련
    USER_NOT_ENOUGH_COIN(-5000, "현재 가지고 있는 골드가 부족합니다."),
    THEMA_DUPLICATE(-5001, "현재 가지고있는 테마 입니다."),
    STICKER_DUPLICATE(-5002, "현재 가지고있는 스티커 입니다."),
    CAPSULE_MAXLIMIT(-5003, "현재 타임캡슐의 최대치 이므로 구매할수 없습니다."),
    CAPSULE_MAXSIZE(-5004, "해당 타임캡슐의 용량사이즈가 최대이므로 구매할수 없습니다."),
    ITEM_NOT_STICKER( -5005, "해당 아이템은 스티커가 아이템이 아닙니다"),
    ITEM_NOT_CAPSULE( -5006, "해당 아이템은 캡슐증가 아이템이 아닙니다"),
    ITEM_NOT_STORAGE(-5007, "해당 아이템은 용량증가 아이템이 아닙니다");


    private final int code;
    private final String message;


}
