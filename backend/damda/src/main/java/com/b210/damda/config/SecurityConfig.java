package com.b210.damda.config;

import com.b210.damda.domain.user.filter.JwtFilter;
import com.b210.damda.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity // 이거 설정해놓으면 시큐리티가 모든 요청을 막아버림.
@Configuration
@RequiredArgsConstructor
// 변경 전에는 WebSecurityConfigurerAdapter 이거 상속받았는데
// 이제는 상속받지 않고 사용함.
public class SecurityConfig {

    private final UserService userService;
    @Value("${jwt.secret}")
    private String secretKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                .httpBasic().disable()
                .csrf().disable()
                .cors().and()
                .authorizeRequests()
                .antMatchers("/user/regist", "/user/login").permitAll() // 회원가입과 로그인은 언제나 가능
                .antMatchers(HttpMethod.PATCH, "/user/update").authenticated() // 해당 요청을 인증 필수로 막아놓음.
                .anyRequest().permitAll() // 위 설정에 없는 모든 요청을 허가함.
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(new JwtFilter(userService, secretKey), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}
