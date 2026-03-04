package com.fullstackwebapp.Controller;

import com.fullstackwebapp.DTO.Login;
import com.fullstackwebapp.DTO.UpdateRequest;
import com.fullstackwebapp.Model.Product;
import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Repository.UserRepo;
import com.fullstackwebapp.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Controller
public class ProductController {

    public ProductService service;

    @Autowired
    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/home")
    public ResponseEntity<?> getProducts(){
    return new ResponseEntity<>(service.getProducts(), HttpStatus.OK);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody Product product,@RequestPart MultipartFile file) throws IOException{

        service.addProduct(product);
        service.addImage(product.getProductId(),file);
        return new ResponseEntity<>("Product added successfully", HttpStatus.OK);
    }
    @PutMapping("/product/{id}/update")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestBody UpdateRequest request,
                                           @RequestPart MultipartFile file) throws IOException {

        service.updateProduct(id,request);
        service.addImage(id,file);

        return new ResponseEntity<>("Product updated successfully", HttpStatus.OK);
    }

    public ResponseEntity<?> Login(@RequestBody Login login) {


    }

    public ResponseEntity<?> Register(@RequestBody User user) {


    }




}
