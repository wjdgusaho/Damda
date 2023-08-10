package com.b210.damda.domain.shop.service;


import com.b210.damda.domain.dto.theme.ThemeChangeDTO;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.theme.ThemeMapping;
import com.b210.damda.domain.shop.repository.ThemeMappingRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThemeSerivce {

    private final UserRepository userRepository;
    private final ThemeMappingRepository themeMappingRepository;

    @Autowired
    public ThemeSerivce(UserRepository userRepository, ThemeMappingRepository themeMappingRepository) {
        this.userRepository = userRepository;
        this.themeMappingRepository = themeMappingRepository;
    }

    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    // 유저의 테마 변경
    public void changeUserTheme(ThemeChangeDTO themeChangeDTO){
        
        // 유저 찾음
        Long userNo = getUserNo();
        User user = userRepository.findById(userNo).get();

        // 유저의 해당 테마 데이터를 꺼내옴
        ThemeMapping userTheme = themeMappingRepository.findByUserAndThemeNo(user, themeChangeDTO.getNowTheme());

        // 해당 테마를 가지고있지 않으면
        if(userTheme == null){
            throw new CommonException(CustomExceptionStatus.DONT_HAVE_THEME);
        }

        // 유저의 테마를 변경
        user.setNowTheme(themeChangeDTO.getNowTheme().intValue());
        userRepository.save(user);
    }
}
