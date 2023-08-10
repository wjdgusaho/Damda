package com.b210.damda.domain.shop.controller;

import com.b210.damda.domain.dto.theme.ThemeChangeDTO;
import com.b210.damda.domain.shop.service.ThemeSerivce;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/theme")
public class ThemeController {

    private final ThemeSerivce themeSerivce;

    @Autowired
    public ThemeController(ThemeSerivce themeSerivce) {
        this.themeSerivce = themeSerivce;
    }

    @PatchMapping("set-my-theme")
    public DataResponse<Map<String, Object>> setMyTheme(@RequestBody ThemeChangeDTO themeChangeDTO){
        try {
            themeSerivce.changeUserTheme(themeChangeDTO);

            return new DataResponse<>(200, "테마 변경 성공");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }
}
