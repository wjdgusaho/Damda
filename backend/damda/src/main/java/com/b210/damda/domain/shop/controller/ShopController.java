package com.b210.damda.domain.shop.controller;

import com.b210.damda.domain.dto.ThemeShopDTO;
import com.b210.damda.domain.dto.TimecapsuleShopDTO;
import com.b210.damda.domain.shop.repository.ThemeRepository;
import com.b210.damda.domain.shop.service.ShopService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.response.CommonResponse;
import com.b210.damda.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/shop")
@Slf4j
public class ShopController {

    private final ShopService shopService;
    
    /*
        모든 아이템 리스트 (테마, 캡슐, 데코) - 보유중 미보유중
     */
    @GetMapping("list")
    public DataResponse<Map<String, Object>> shopList(@RequestParam("userNo") Long userNo) throws Exception {
         List<ThemeShopDTO> themeList = shopService.getThemeList(userNo);
         Map<String, Object> itemsList = shopService.getItemList(userNo);

         itemsList.put("themeList", themeList);
         DataResponse<Map<String, Object>> response = new DataResponse<>(200, "아이템 리스트 조회 성공");
         response.setData(itemsList);

        return response;
    }

    /*
        테마 구입 
     */
    @PostMapping("purchase/theme")
    public DataResponse<Map<String, Object>> buyTheme(@RequestBody Map<String, Object> data) {

        Long userNo = Long.parseLong((String) data.get("userNo"));
        Long themeNo = Long.parseLong((String) data.get("themeNo"));

        Map<String, Object> themeList = shopService.buyTheme(userNo, themeNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "테마 구매 성공");
        response.setData(themeList);

        return response;
    }

    /*
        스티커(데코) 구입
     */
    @PostMapping("purchase/sticker")
    public DataResponse<Map<String, Object>> buySticker(@RequestBody Map<String, Object> data){

        Long userNo = Long.parseLong((String) data.get("userNo"));
        Long itemNo = Long.parseLong((String) data.get("itemNo"));

        Map<String, Object> itemList = shopService.buySticker(userNo, itemNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "스티커팩 구매 성공");
        response.setData(itemList);

        return  response;
    }

    /*
        타임캡슐 갯수 추가 구매
     */
    @PostMapping("purchase/timecapsule/limit")
    public DataResponse<Map<String, Object>> buyCapsuleLimit(@RequestBody Map<String, Object> data){

        Long userNo = Long.parseLong((String) data.get("userNo"));
        Long itemNo = Long.parseLong((String) data.get("itemNo"));

        Map<String, Object> capsuleLimit = shopService.buyCapsuleLimit(userNo, itemNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 최대 개수 구매 성공");
        response.setData(capsuleLimit);

        return response;
    }

    /*
        타임캡슐 리스트 받아오기
     */
    @GetMapping("purchase/timecapsule/list")
    public DataResponse<Map<String, Object>> buyCapsuleList(@RequestParam Map<String,Object> data){

        Long userNo = Long.parseLong((String) data.get("userNo"));
        List<TimecapsuleShopDTO> timecapsuleList = shopService.timecapsuleList(userNo);

        Map<String, Object> result = new HashMap<>();
        result.put("timecapsuleList", timecapsuleList);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 목록 조회 성공");
        response.setData(result);

        return response;
    }

    /*
        타임캡슐 용량 구매하기
     */
    @PostMapping("purchase/timecapsule/size")
    public CommonResponse buyCapsuleSize(@RequestBody Map<String, Object> data){

        Long userNo = Long.parseLong((String) data.get("userNo"));
        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));
        Long itemNo = Long.parseLong((String) data.get("itemNo"));

        shopService.timecapsuleSize(userNo, timecapsuleNo, itemNo);

        CommonResponse response = new CommonResponse(200, "타임캡슐 용량 증가 성공!");

        return response;
    }
}
