package com.b210.damda.util.emailAPI.service;

import com.b210.damda.domain.entity.User;
import org.springframework.stereotype.Service;

public interface EmailService {

    Long changeTempKey(String key, String email, User user);

    Long registTempKey(String key, String email);

    String sendSimpleMessageChange(String email)throws Exception;;

    String sendSimpleMessageRegist(String email)throws Exception;;
}
