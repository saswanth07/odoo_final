package com.ps2.service;

import com.ps2.dto.CustomerDto;
import com.ps2.entity.Customer;
import java.util.List;

public interface CustomerService {
    CustomerDto createCustomer(CustomerDto customerDto);
    CustomerDto updateCustomer(Long id, CustomerDto customerDto);
    void deleteCustomer(Long id);
    CustomerDto getCustomerById(Long id);
    List<CustomerDto> getAllCustomers();
    List<Customer> searchCustomers(String query);
}
