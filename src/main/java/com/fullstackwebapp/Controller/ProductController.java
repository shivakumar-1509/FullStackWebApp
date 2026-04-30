package com.fullstackwebapp.Controller;

import com.fullstackwebapp.DTO.UpdateRequest;
import com.fullstackwebapp.Model.Product;
import com.fullstackwebapp.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ProductController {

    private final ProductService service;

    @Autowired
    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/home")
    public ResponseEntity<?> getProducts(){
        return new ResponseEntity<>(service.getProducts(), HttpStatus.OK);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody UpdateRequest request,
                                        @RequestPart MultipartFile file) throws IOException {

        service.addProduct(request);
//        service.addImage(product.getProductId(),file);
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

    @DeleteMapping("/product/{id}/delete")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        try {

            return new ResponseEntity<>(service.deleteProduct(id), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "error while deleting product");
        }

    }

    @GetMapping("/user/products")
    public ResponseEntity<?> getProductByUser(){
        return new ResponseEntity<>(service.findProductByUser(),HttpStatus.OK);
    }

}
