package test.ssafy.domain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import test.ssafy.domain.dto.UserRegistDTO;
import test.ssafy.domain.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    public UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("regist")
    public ResponseEntity<?> regist(@RequestBody UserRegistDTO userRegistDTO){
        Long savedId = userService.regist(userRegistDTO);
        System.out.println(savedId);
        return new ResponseEntity<>(savedId, HttpStatus.OK);
    }
}
