package com.fullstackwebapp.Controller;

import com.fullstackwebapp.DTO.Login;
import com.fullstackwebapp.DTO.UpdateRequest;
import com.fullstackwebapp.Model.Product;
import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Repository.UserRepo;
import com.fullstackwebapp.Service.JwtService;
import com.fullstackwebapp.Service.ProductService;
import org.apache.tomcat.util.json.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Controller
public class ProductController {

    private final JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;
    public ProductService service;



    @Autowired
    public ProductController(ProductService service, AuthenticationManager authenticationManager,JwtService jwtService) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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
    @PostMapping("/user/login")
    public String Login(@RequestBody Login login) {

        if(login == null){
            System.out.println("Login null");
        }
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(login.getUsername(),login.getPassword()));
        if(authentication.isAuthenticated())
            return jwtService.generateToken(login.getUsername());
        else return "Login Failed";

            }



    @PostMapping("/user/register")
    public ResponseEntity<?> Register(@RequestBody User user) {

        if(user==null){
            return new ResponseEntity<>("Enter the valid details", HttpStatus.BAD_REQUEST);
        }
        else {
            service.register(user);
            return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
        }
    }




}
