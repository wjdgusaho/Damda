package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.dto.ItemsShopDTO;
import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface ShopService {
    List<ThemaShopDTO> getThemaList(Long userNo) throws Exception;
    List<ThemaShopDTO> getThemList() throws Exception;
    List<ThemaMappingDTO> getThemMappingList(Long userNo) throws Exception;
    Map<String, Object> getItemList(Long userNo) throws Exception;
    List<ItemsMappingDTO> getItemsMappginList(Long userNo) throws Exception;
    List<ItemsShopDTO> getItemList() throws Exception;
}
