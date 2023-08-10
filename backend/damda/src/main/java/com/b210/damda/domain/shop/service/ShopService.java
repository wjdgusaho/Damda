package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.*;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleShopDTO;
import com.b210.damda.domain.dto.theme.ThemeMappingDTO;
import com.b210.damda.domain.dto.theme.ThemeShopDTO;

import java.util.List;
import java.util.Map;

public interface ShopService {
    List<ThemeShopDTO> getThemeList();
    List<ThemeShopDTO> getThemAllList();
    List<ThemeMappingDTO> getThemMappingList();
    Map<String, Object> getItemList();
    List<ItemsMappingDTO> getItemsMappginList();
    List<ItemsShopDTO> getItemAllList();

    Map<String, Object> buyTheme(Long themeNo);

    Map<String, Object> buySticker(Long itemNo);

    Map<String, Object> buyCapsuleLimit(Long itemNo);

    List<TimecapsuleShopDTO> timecapsuleList();

    void timecapsuleSize(Long timecapsuleNo, Long itemNo);
}
