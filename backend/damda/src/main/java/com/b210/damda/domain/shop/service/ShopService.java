package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ThemaShopDTO;

import java.util.List;

public interface ShopService {
    List<ThemaShopDTO> getThemaList(Long userNo) throws Exception;
}
