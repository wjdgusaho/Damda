package com.b210.damda.util.emailAPI.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.b210.damda.domain.entity.EmailSendLog;
import com.b210.damda.domain.entity.SignupEmailLog;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import com.b210.damda.util.emailAPI.repository.SignupEmailLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailServiceImpl implements EmailService {

    JavaMailSender emailSender;
    EmailSendLog emailSendLog;
    EmailSendLogRepository emailSendLogRepository;
    SignupEmailLogRepository signupEmailLogRepository;
    SignupEmailLog signupEmailLog;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender, EmailSendLogRepository emailSendLogRepository, SignupEmailLogRepository signupEmailLogRepository) {
        this.emailSender = emailSender;
        this.emailSendLogRepository = emailSendLogRepository;
        this.signupEmailLogRepository = signupEmailLogRepository;
    }

    private MimeMessage createMessageChange(String to, String authCode)throws Exception{
        System.out.println("보내는 대상 : " + to);
        System.out.println("인증 번호 : " + authCode);
        MimeMessage  message = emailSender.createMimeMessage();

        message.addRecipients(RecipientType.TO, to);//보내는 대상
        message.setSubject("(담다) 비밀번호 재설정 이메일입니다.");//제목

        String msgg="";
        msgg += "<table style='    width: 100% !important;    background: #ffffff;    margin: 0;    padding: 0;    min-width: 100%;    font-family: 'Malgun Gothic', 'Dotum', 'sans-serif';   '>";
        msgg += "<tr><td style='text-align: center;'>";
        msgg += "<img src='https://damda.s3.ap-northeast-2.amazonaws.com/EMAIL_CONFIRM/EMAIL_CONFIRM.png' alt='header' loading='lazy'>";
        msgg += "</td></tr><tr><td style='text-align: center;'>";
        msgg += "<div style='margin-top: 60px; margin-bottom: 30px;'>";
        msgg += "<h1 style='margin-bottom: 40px;'>계정 인증 안내</h1>";
        msgg += "<p style='margin-top: 0; margin-bottom: 15px; line-height:2;'>";
        msgg += "담다 계정 본인 확인 메일입니다.<br>";
        msgg += "아래 인증번호를 입력하시고 본인 인증을 완료해주세요.<br>";
        msgg += "(인증번호는 10분간 유효합니다.)";
        msgg += "</p></div></td></tr><tr><td style='text-align: center;'>";
        msgg += "<div style='margin-bottom: 60px;'>";
        msgg += "<p style='display:inline-block;padding:20px 80px;font-size:16px;font-weight:bold;color:#fff;background:#9a50ff;'>";
        msgg += "인증번호: " + authCode;
        msgg += "</p></div></td></tr><tr><td style='text-align: center;'>";
        msgg += "<img src='https://damda.s3.ap-northeast-2.amazonaws.com/EMAIL_CONFIRM/DAMDA.png' alt='footer' loading='lazy'>";
        msgg += "</td></tr></tbody></table>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("damdaCop@gmail.com","담다"));//보내는 사람

        return message;
    }

    private MimeMessage createMessageRegist(String to, String authCode)throws Exception{
        System.out.println("보내는 대상 : " + to);
        System.out.println("인증 번호 : " + authCode);
        MimeMessage  message = emailSender.createMimeMessage();

        message.addRecipients(RecipientType.TO, to);//보내는 대상
        message.setSubject("(담다) 회원가입 인증번호 이메일입니다.");//제목

        String msgg="";
        msgg += "<table style='    width: 100% !important;    background: #ffffff;    margin: 0;    padding: 0;    min-width: 100%;    font-family: 'Malgun Gothic', 'Dotum', 'sans-serif';   '>";
        msgg += "<tr><td style='text-align: center;'>";
        msgg += "<img src='https://damda.s3.ap-northeast-2.amazonaws.com/EMAIL_CONFIRM/EMAIL_CONFIRM.png' alt='header' loading='lazy'>";
        msgg += "</td></tr><tr><td style='text-align: center;'>";
        msgg += "<div style='margin-top: 60px; margin-bottom: 30px;'>";
        msgg += "<h1 style='margin-bottom: 40px;'>계정 인증 안내</h1>";
        msgg += "<p style='margin-top: 0; margin-bottom: 15px; line-height:2;'>";
        msgg += "담다 계정 본인 확인 메일입니다.<br>";
        msgg += "아래 인증번호를 입력하시고 본인 인증을 완료해주세요.<br>";
        msgg += "(인증번호는 10분간 유효합니다.)";
        msgg += "</p></div></td></tr><tr><td style='text-align: center;'>";
        msgg += "<div style='margin-bottom: 60px;'>";
        msgg += "<p style='display:inline-block;padding:20px 80px;font-size:16px;font-weight:bold;color:#fff;background:#9a50ff;'>";
        msgg += "인증번호: " + authCode;
        msgg += "</p></div></td></tr><tr><td style='text-align: center;'>";
        msgg += "<img src='https://damda.s3.ap-northeast-2.amazonaws.com/EMAIL_CONFIRM/DAMDA.png' alt='footer' loading='lazy'>";
        msgg += "</td></tr></tbody></table>";
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

    public String sendSimpleMessageChange(String to)throws Exception {
        String authCode =  createKey(); // 인증코드 생성
        MimeMessage message = createMessageChange(to, authCode); // 메시지 생성
        try{ // 예외처리
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
        return authCode;
    }

    public String sendSimpleMessageRegist(String to)throws Exception {
        String authCode =  createKey(); // 인증코드 생성
        MimeMessage message = createMessageRegist(to, authCode); // 메시지 생성
        try{ // 예외처리
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
        return authCode;
    }


    @Override
    @Transactional
    public Long changeTempKey(String key, String email, User user) {
        EmailSendLog build = emailSendLog.builder()
                .email(email)
                .verificationCode(key)
                .user(user)
                .createTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        EmailSendLog save = emailSendLogRepository.save(build);

        return save.getEmailSendLogNo();
    }

    @Override
    @Transactional
    public Long registTempKey(String key, String email) {
        SignupEmailLog build = SignupEmailLog.builder()
                .email(email)
                .verificationCode(key)
                .createTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        SignupEmailLog save = signupEmailLogRepository.save(build);
        return save.getSignupEmailLogNo();
    }


}