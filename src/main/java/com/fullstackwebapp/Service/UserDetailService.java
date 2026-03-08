package com.fullstackwebapp.Service;

import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Model.UserPrinciple;
import com.fullstackwebapp.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {

    public UserRepo userRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Autowired
    public UserDetailService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);

        if(user==null){
            System.out.println("User not found");
            throw new UsernameNotFoundException(username);
        }
        else{
            System.out.println(user.getUsername());
        return new UserPrinciple(user);
        }
    }


    public String register(User user) {
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole());
        if(userRepo.findByUsername(user.getUsername())!=null){
            return "User already exists with this username try with other username";
        }
        else {
            user.setUsername(user.getUsername());
            userRepo.save(user);
            return "User registered successfully";
        }
    }

    public String find(String username){
        if(userRepo.findByUsername(username)!=null){
            return "your username password incorrect";
        }else return null;
    }
}
