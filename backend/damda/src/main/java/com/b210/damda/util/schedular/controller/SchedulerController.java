package com.b210.damda.util.schedular.controller;

import com.b210.damda.util.schedular.service.ScheduledService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SchedulerController {

    private final ScheduledService scheduledService;

    public void triggerScheduledTask() {
        scheduledService.scheduledTask();
    }
}
