package com.b210.damda.util.canvas.controller;


import com.amazonaws.util.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Base64;

@Controller
@RequestMapping(value="/html2canvas")
public class html2canvasController {

    // 이미지의 실제 형식을 판별하는 메서드
    public String determineImageType(byte[] imageData) {
        if (imageData[0] == (byte) 0x89 && imageData[1] == (byte) 0x50 && imageData[2] == (byte) 0x4E && imageData[3] == (byte) 0x47) {
            return "png";
        } else if (imageData[0] == (byte) 0xFF && imageData[1] == (byte) 0xD8) {
            return "jpeg";
        }
        return null;
    }

    @RequestMapping(value="/proxy.json", method= RequestMethod.GET)
    @ResponseBody
    public String html2canvasProxy(HttpServletRequest req) {
        byte[] data = null;
        try {
            URL url = new URL(URLDecoder.decode(req.getParameter("url"),
                    java.nio.charset.StandardCharsets.UTF_8.toString()));

            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            if (connection.getResponseCode() == 200) {
                data = IOUtils.toByteArray(connection.getInputStream());

                // 판별된 이미지 타입을 기반으로 MIME 타입 설정
                String imageType = determineImageType(data);
                if (imageType != null) {
                    return "data:image/" + imageType + ";base64," + Base64.getEncoder().encodeToString(data);
                }
            } else {
                System.out.println("responseCode : " + connection.getResponseCode());
            }
        } catch (MalformedURLException e) {
            data = "wrong URL".getBytes(java.nio.charset.StandardCharsets.UTF_8);
        } catch(Exception e) {
            System.out.println(e);
        }
        return null;
    }
}