package com.b210.damda.util.emailAPI.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Random;

import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.b210.damda.domain.entity.EmailSendLog;
import com.b210.damda.domain.entity.User;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    JavaMailSender emailSender;
    EmailSendLog emailSendLog;
    EmailSendLogRepository emailSendLogRepository;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender, EmailSendLogRepository emailSendLogRepository) {
        this.emailSender = emailSender;
        this.emailSendLogRepository = emailSendLogRepository;
    }

    private MimeMessage createMessage(String to, String authCode)throws Exception{
        System.out.println("보내는 대상 : " + to);
        System.out.println("인증 번호 : " + authCode);
        MimeMessage  message = emailSender.createMimeMessage();

        message.addRecipients(RecipientType.TO, to);//보내는 대상
        message.setSubject("(담다) 비밀번호 재설정 이메일입니다.");//제목

        String msgg="";
        msgg+= "<div style='margin:20px;'>";
        msgg+= "<h1> 안녕하세요 담다입니다. </h1>";
        msgg+= "<br>";
        msgg+= "<p>아래 코드를 복사해 입력해주세요<p>";
        msgg+= "<br>";
        msgg+= "<p>감사합니다.<p>";
        msgg+= "<br>";
        msgg+= "<div align='center' style='border:1px solid black; font-family:verdana';>";
        msgg+= "<h3 style='color:blue;'>회원가입 인증 코드입니다.</h3>";
        msgg+= "<div style='font-size:130%'>";
        msgg+= "CODE : <strong>";
        msgg+= authCode + "</strong><div><br/> ";
        msgg+= "</div>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("damdaCop@gmail.com","담다"));//보내는 사람

        return message;
    }

    public static String createKey() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        int length = 16;
        SecureRandom rnd = new SecureRandom();

        StringBuilder key = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            key.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return key.toString();
    }
    @Override
    public String sendSimpleMessage(String to)throws Exception {
        String authCode =  createKey(); // 인증코드 생성
        MimeMessage message = createMessage(to, authCode); // 메시지 생성
        try{ // 예외처리
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
        return authCode;
    }

    @Override
    public Long registTempKey(String key, String email, User user) {
        EmailSendLog build = emailSendLog.builder()
                .email(email)
                .verificationCode(key)
                .user(user)
                .createTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(1))
                .build();

        EmailSendLog save = emailSendLogRepository.save(build);
        System.out.println(save);
        return save.getEmailSendLogNo();
    }


}