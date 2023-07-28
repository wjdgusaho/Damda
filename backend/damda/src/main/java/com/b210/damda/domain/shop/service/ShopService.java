package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.dto.ItemsShopDTO;
import com.b210.damda.domain.dto.ThemeMappingDTO;
import com.b210.damda.domain.dto.ThemeShopDTO;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface ShopService {
    List<ThemeShopDTO> getThemeList(Long userNo);
    List<ThemeShopDTO> getThemAllList();
    List<ThemeMappingDTO> getThemMappingList(Long userNo);
    Map<String, Object> getItemList(Long userNo);
    List<ItemsMappingDTO> getItemsMappginList(Long userNo);
    List<ItemsShopDTO> getItemAllList();

    Map<String, Object> buyTheme(Long userNo, Long themeNo);

    Map<String, Object> buySticker(Long userNo, Long itemNo);

    Map<String, Object> buyCapsuleLimit(Long userNo, Long itemNo);
}
