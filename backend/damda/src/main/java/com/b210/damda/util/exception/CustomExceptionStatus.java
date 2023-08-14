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
    THEMA_NOT_FOUND(-6000, "해당 테마가 존재하지 않습니다."),
    ITEM_NOT_FOUND(-6001, "해당 아이템이 존재하지 않습니다."),
    NOT_TIMECAPSULE(-6002, "타임캠슐이 존재하지 않습니다."),
    NOT_WORK_TIMECAPSULE(-6003, "현재 진행중인 타임캡슐이 없습니다."),
    NOT_SAVE_TIMECAPSULE(-6004, "저장된 타임캡슐이 없습니다."),
    NOT_CARD(-6005, "작성된 카드가 없습니다."),
    NOT_USER(-6006, "없는 유저입니다."),
    BAD_QUERY_FORMAT(-6007, "(닉네임)#(번호) 양식에 맞춰서 검색해주세요."),
    DELETE_TIMECAPSULE(-6008, "삭제된 타임캡슐입니다."),
    NOT_LOCATION_FIND(-6009, "서비스 불가 위치입니다."),
    KICK_NOT_USER(-6010, "강퇴하려는 유저가 없는 유저입니다."),
    NOT_REQUESTED_FRIEND(-6011, "잘못된 친구 요청입니다."),
    DONT_HAVE_THEME(-6012, "해당 테마를 가지고있지 않습니다."),
    NOT_FOUND_FILE(-6013, "파일이 존재하지 않습니다."),
    NOT_MATCH_TIMECAPSULE_CARD(-6014, "해당 타임캡슐의 카드가 아닙니다."),


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
    NOT_BUY_DECOITEM(-5009, "구매하신 꾸미기 아이템이 없습니다"),


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
    CREATE_TIMECAPSULEUSERMAPPING(-4003, "타임캡슐 유저 매핑 에러 발생"),
    NOT_CREATE_TIMECAPSULE_USERLIMIT(-4004, "생성 및 참여 할 수 있는 타임캡슐의 공간이 부족합니다."),

    // 타임캡슐
    NOT_ALLOW_PARTICIPATE(-3000, "참가 불가능한 타임캡슐입니다."),
    NOT_CARD_SAVE(-3001, "카드 저장에 실패했습니다"),
    NOT_S3_CARD_SAVE(-3002, "S3 카드값 저장 실패"),
    NOT_CARDIMAGE(-3003, "입력받은 카드 이미지가 없습니다"),
    ALREADY_PARTICIPATING(-3004, "이미 참여중인 타임캡슐입니다."),
    MAX_PARTICIPATING(-3005, "해당 타임캡슐의 참여인원이 꽉 찼습니다."),
    NOT_INVITE_FRIEND(-3006, "24시간이 지나서 친구 초대가 불가능합니다."),
    NOT_TIMECAPSULE_HOST(-3007, "해당 타임캡슐의 방장이 아닙니다."),
    KICKUSER_NOT_TIMECAPSULE(-3008, "강퇴하는 유저는 해당 타임캡슐 참가자가 아닙니다."),
    NOT_DELTE_TIMECAPSULE(-3009, "생성된지 24시간 이후로 삭제할수 없습니다"),
    ALREADY_INVITED_USER(-3010, "이미 초대된 회원입니다."),
    FULL_USER_TIMECAPSULE(-3011, "보유 가능한 타임캡슐의 개수를 초과했습니다. 상점에서 아이템 구매 부탁드립니다."),
    CARD_SAVE_NULL_ERR(-3012, "카드 저장 에러 (이미지 값이 없습니다)"),
    NOT_RECORD_INVITE(-3013, "잘못 온 초대 기록입니다."),
    ALREADY_JOIN_TIMECAPSULE(-3014, "해당 유저는 이미 참여중입니다."),
    ALREADY_KICKED_OUT_USER(-3015, "이미 강퇴 당했거나 나간 유저입니다."),
    FILE_LIMIT_NOT_UPLOAD(-3014, "최대 파일 업로드 가능 용량을 초과하여 업로드에 실패했습니다"),
    FILE_NOT_UPLOAD(-3015, "파일 업로드에 실패했습니다"),
    ALREADY_CARD_UPLOAD(-3016, "오늘은 카드 작성을 하셨습니다"),
    ALREADY_FILE_UPLOAD(-3017, "오늘은 파일 업로드를 하셨습니다"),
    NOT_USER_TIMECAPSULE(-3018, "해당 유저의 타임캡슐이 아닙니다."),
    NOT_SAVED_TIMECAPSULE(-3019, "저장되지 않은 타임캡슐입니다."),
    NOT_OPEN_TIMECAPSULE(-3020, "아직 열지 않은 타임캡슐입니다."),
    ALREADY_SAVE_TIMECAPSULE(-3021, "이미 저장된 타임캡슐입니다"),

    // 확장자 문제
    EXTENSION_ERROR_IMAGE(-8000, "사진 확장자만 등록 가능합니다."),
    EXTENSION_ERROR_FILE(-8001, "음성, 영상 확장자만 등록 가능합니다.");



    private final int code;
    private final String message;


}
