package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.dto.ItemsShopDTO;
import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface ShopService {
    List<ThemaShopDTO> getThemaList(Long userNo);
    List<ThemaShopDTO> getThemAllList();
    List<ThemaMappingDTO> getThemMappingList(Long userNo);
    Map<String, Object> getItemList(Long userNo);
    List<ItemsMappingDTO> getItemsMappginList(Long userNo);
    List<ItemsShopDTO> getItemAllList();

    Map<String, Object> buyThema(Long userNo, Long themaNo);

    Map<String, Object> buySticker(Long userNo, Long itemNo);

    Map<String, Object> buyCapsuleLimit(Long userNo, Long itemNo);
}
