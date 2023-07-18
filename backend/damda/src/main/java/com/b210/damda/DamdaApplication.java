package com.b210.damda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class DamdaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DamdaApplication.class, args);
	}

}
