package com.b210.damda.util.emailAPI.service;

import com.b210.damda.domain.entity.User;
import org.springframework.stereotype.Service;

public interface EmailService {
    String sendSimpleMessage(String to)throws Exception;

    Long registTempKey(String key, String email, User user);
}
