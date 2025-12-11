package com.platemate.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Configuration
@EnableConfigurationProperties(RazorpayProperties.class)
public class RazorpayConfig {

    @Bean
    public RestTemplate razorpayRestTemplate(RazorpayProperties props) {
        RestTemplate restTemplate = new RestTemplate();

        // Interceptor that can be reused to add Basic Auth for Razorpay API calls.
        ClientHttpRequestInterceptor authInterceptor = (request, body, execution) -> {
            String creds = props.getRazorpay().getKeyId() + ":" + props.getRazorpay().getKeySecret();
            String encoded = Base64.getEncoder().encodeToString(creds.getBytes(StandardCharsets.UTF_8));
            request.getHeaders().add("Authorization", "Basic " + encoded);
            return execution.execute(request, body);
        };

        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>(restTemplate.getInterceptors());
        interceptors.add(authInterceptor);
        restTemplate.setInterceptors(interceptors);
        return restTemplate;
    }

    @Bean
    public RestTemplate razorpayXRestTemplate(RazorpayProperties props) {
        RestTemplate restTemplate = new RestTemplate();

        ClientHttpRequestInterceptor authInterceptor = (request, body, execution) -> {
            String creds = props.getRazorpayx().getKeyId() + ":" + props.getRazorpayx().getKeySecret();
            String encoded = Base64.getEncoder().encodeToString(creds.getBytes(StandardCharsets.UTF_8));
            request.getHeaders().add("Authorization", "Basic " + encoded);
            return execution.execute(request, body);
        };

        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>(restTemplate.getInterceptors());
        interceptors.add(authInterceptor);
        restTemplate.setInterceptors(interceptors);
        return restTemplate;
    }
}


