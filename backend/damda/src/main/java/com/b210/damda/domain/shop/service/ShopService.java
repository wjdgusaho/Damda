package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.*;

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

    List<TimecapsuleShopDTO> timecapsuleList(Long userNo);

    void timecapsuleSize(Long userNo, Long timecapsuleNo, Long itemNo);
}
