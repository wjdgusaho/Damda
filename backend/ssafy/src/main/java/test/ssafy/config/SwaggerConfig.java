package test.ssafy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;


@Configuration
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2).select().apis(RequestHandlerSelectors.basePackage("com.test.ssafy.domain.controller"))
                .paths(PathSelectors.ant("/api*/**")).build().apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("SSAFY 9기 스프링 관통 프로젝트").description("엄청난 관통 프로젝트다.")
                .version("0.1").build();
    }
}