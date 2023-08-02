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
    NOT_TIMECAPSULE(-6002, "타임캠슐이 존재하지 않습니다"),
    NOT_WORK_TIMECAPSULE(-6003, "현재 진행중인 타임캡슐이 없습니다"),
    NOT_SAVE_TIMECAPSULE(-6004, "저장된 타임캡슐이 없습니다."),
    NOT_CARD(-6005, "작성된 카드가 없습니다"),
    NOT_USER(-6006, "없는 유저입니다."),
    BAD_QUERY_FORMAT(-6007, "(닉네임)#(번호) 양식에 맞춰서 검색해주세요."),


    //상점 관련
    USER_NOT_ENOUGH_COIN(-5000, "현재 가지고 있는 골드가 부족합니다."),
    THEME_DUPLICATE(-5001, "현재 가지고있는 테마 입니다."),
    STICKER_DUPLICATE(-5002, "현재 가지고있는 스티커 입니다."),
    CAPSULE_MAXLIMIT(-5003, "현재 타임캡슐의 최대치 이므로 구매할수 없습니다."),
    CAPSULE_MAXSIZE(-5004, "해당 타임캡슐의 용량사이즈가 최대이므로 구매할수 없습니다."),
    ITEM_NOT_STICKER( -5005, "해당 아이템은 스티커가 아이템이 아닙니다"),
    ITEM_NOT_CAPSULE( -5006, "해당 아이템은 캡슐증가 아이템이 아닙니다"),
    ITEM_NOT_STORAGE(-5007, "해당 아이템은 용량증가 아이템이 아닙니다"),
    USER_NOT_TIMECAPSULE (-5008, "해당 유저의 타임캡슐이 아닙니다"),


    //유저 관련
    USER_NOT_FOUND(-9000, "존재하지 않는 회원입니다."),
    EMAIL_NOT_FOUND(-9006, "이메일이 일치하지 않습니다."),
    NOT_MATCH_CODE(-9001, "인증번호가 일치하지 않습니다."),
    EXPIRE_CODE(-9002, "인증번호가 만료되었습니다."),
    ALREADY_USED_CODE(-9003, "이미 사용된 인증번호입니다."),
    NOT_MATCH_PASSWORD(-9004, "비밀번호가 일치하지 않습니다."),
    USER_ALREADY_DEACTIVATED(-9005, "탈퇴한 유저입니다."),
    KAKAO_USER(-9006, "카카오로 가입한 회원입니다. 카카오로 로그인 부탁드립니다."),
    SAME_PASSWORD(-9007, "기존 비밀번호와 동일합니다."),

    // 토큰 관련
    NOT_FOUND_JWT_TOKEN(-1000, "잘못된 접근입니다. 로그아웃 후 다시 로그인 부탁드립니다."),

    //생성 관련
    CREATE_TIMECAPSULE(-4001, "타임캡슐 생성 오류 발생"),
    CREATE_CIRTERIADAY( -4002, "타임캡슐 요일조건 생성 에러 발생"),
    CREATE_TIMECAPSULEUSERMAPPING(-4003, "타임캡슐 유저 매핑 에러 발생");

    private final int code;
    private final String message;


}
