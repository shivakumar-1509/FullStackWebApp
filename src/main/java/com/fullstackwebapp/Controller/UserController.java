package com.fullstackwebapp.Controller;

import com.fullstackwebapp.DTO.Login;
import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Service.JwtService;
import com.fullstackwebapp.Service.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/")
public class UserController {

    private final UserDetailService service;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserDetailService service, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("register")
    public ResponseEntity<String> RegisterUser(@RequestBody User user){
        if(user == null){
            return new ResponseEntity<>("Enter the valid details",HttpStatus.BAD_REQUEST);
        }
        else {
            return new ResponseEntity<>(service.register(user),HttpStatus.OK);
        }
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Login login){
        if(login == null){
            return new ResponseEntity<>("Invalid Credentials", HttpStatus.NOT_ACCEPTABLE);
        }
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(login.getUsername(),login.getPassword()));

        if(authentication.isAuthenticated()){
            String token = jwtService.generateToken(login.getUsername());
            return new ResponseEntity<>(token, HttpStatus.OK);
        }
        else return  new ResponseEntity<>("Unsuccessful Login", HttpStatus.UNAUTHORIZED);
    }

}
