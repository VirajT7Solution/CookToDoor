package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.CustomerDtos;
import com.platemate.model.Customer;
import com.platemate.model.User;
import com.platemate.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<CustomerDtos.Response> create(@RequestBody CustomerDtos.CreateRequest req) {
        User user = service.requireUser(req.getUserId());
        Customer c = new Customer();
        c.setUser(user);
        c.setFullName(req.getFullName());
        c.setDateOfBirth(req.getDateOfBirth());
        Customer saved = service.create(c);
        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<CustomerDtos.Response> update(@PathVariable Long id, @RequestBody CustomerDtos.UpdateRequest req) {
        Customer u = new Customer();
        u.setFullName(req.getFullName());
        u.setDateOfBirth(req.getDateOfBirth());
        Customer saved = service.update(id, u);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER','CUSTOMER')")
    public ResponseEntity<List<CustomerDtos.Response>> list() {
        List<CustomerDtos.Response> data = service.listActive().stream().map(this::toResponse).toList();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER','CUSTOMER')")
    public ResponseEntity<CustomerDtos.Response> getById(@PathVariable Long id) {
        return service.getById(id).map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER','CUSTOMER')")
    public ResponseEntity<CustomerDtos.Response> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId).map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    private CustomerDtos.Response toResponse(Customer c) {
        CustomerDtos.Response res = new CustomerDtos.Response();
        res.setId(c.getId());
        res.setUserId(c.getUser() != null ? c.getUser().getId() : null);
        res.setFullName(c.getFullName());
        res.setDateOfBirth(c.getDateOfBirth());
        return res;
    }
}


