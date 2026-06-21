package com.ps2.mapper;

import com.ps2.dto.CustomerDto;
import com.ps2.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerDto toDto(Customer entity) {
        if (entity == null) {
            return null;
        }
        CustomerDto dto = new CustomerDto();
        dto.setCustomerId(entity.getCustomerId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        return dto;
    }

    public Customer toEntity(CustomerDto dto) {
        if (dto == null) {
            return null;
        }
        Customer entity = new Customer();
        entity.setCustomerId(dto.getCustomerId());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        return entity;
    }
}
