package com.fullstackwebapp.Service;

import com.fullstackwebapp.DTO.UpdateRequest;
import com.fullstackwebapp.Model.Product;
import com.fullstackwebapp.Model.Role;
import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Repository.ProductRepository;
import com.fullstackwebapp.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ProductService {

    public ProductRepository repository;
    public UserRepo userRepo;



    @Autowired
    public ProductService( UserRepo userRepo,ProductRepository repository) {
        this.userRepo = userRepo;
        this.repository = repository;
    }


    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getProducts(){
        List<Product> p = repository.findAll();
        if(p.isEmpty()){
            return List.of(new Product());
        }
        else return p;
    }

    public User getInfo(){
        String Username = Objects.requireNonNull(SecurityContextHolder.getContext()
                .getAuthentication()).getName();
        if(Username == null){
            throw new UsernameNotFoundException("Username not found");
        }
        return userRepo.findByUsername(Username);
    }

    public boolean getrole(Product product,User user){
        return product.getCreatedBy().getId().equals(user.getId())
                || user.getRole()== Role.ADMIN;
    }

    public void addProduct(Product product) {
        User user = getInfo();

        product.setCreatedBy(user);
        product.setProductDate(new Date());

        repository.save(product);
    }



    public void updateProduct(Long id, UpdateRequest request) {
        User user = getInfo();
        Product product= repository.findById(id).orElseThrow(()->new NoSuchElementException("Product not found"));

        if(!getrole(product,user)) {
            throw new RuntimeException("User is not Authorized");
        }

        if(request.getProductName() != null){
            product.setProductName(request.getProductName());
        }
        if(request.getProductDescription() != null){
            product.setProductDescription(request.getProductDescription());
        }
        if(request.getProductPrice() != null){
            product.setProductPrice(request.getProductPrice());
        }
        if(request.getProductPrice() != null){
            product.setProductPrice(request.getProductPrice());
        }
        if(request.getProductCategory()!= null){
            product.setProductCategory(request.getProductCategory());
        }

        repository.save(product);
    }

    public void addImage(Long id, MultipartFile image) throws IOException {
        Product product = repository.findById(id)
                .orElseThrow(()->new NoSuchElementException("Product not found"));

        User user = getInfo();

        if(!getrole(product,user)) {
            throw new RuntimeException("User is not Authorized");
        }

        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setProductImage(image.getBytes());
        repository.save(product);
    }

    public String deleteProduct(Long id) {
        if(repository.findById(id).isPresent()){
            repository.deleteById(id);
            return "product deleted";
        }
        else return "product not found";
    }

    public List<Product> findProductByUser(){
        return repository.findProductByCreatedBy(getInfo().getId());
    }

}
