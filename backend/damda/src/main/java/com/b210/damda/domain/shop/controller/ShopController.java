package com.b210.damda.domain.shop.controller;

import com.b210.damda.domain.dto.ThemaShopDTO;
import com.b210.damda.domain.shop.repository.ThemaRepository;
import com.b210.damda.domain.shop.service.ShopService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/shop")
@Slf4j
public class ShopController {

    private final ShopService shopService;

    @GetMapping("list")
    public DataResponse<Map<String, Object>> shopList(@RequestBody Map<String, Object> data) throws Exception {
         Long userNo = Long.parseLong((String) data.get("userNo"));
         List<ThemaShopDTO> themaList = shopService.getThemaList(userNo);

        return null;
    }

}
