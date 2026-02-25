package com.fullstackwebapp.Service;

import com.fullstackwebapp.Model.User;
import com.fullstackwebapp.Model.UserPrinciple;
import com.fullstackwebapp.Repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class userDetailService implements UserDetailsService {

    public UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findById(username).orElse(null);

        if(user==null){
            throw new UsernameNotFoundException(username);
        }
        else{
        return new UserPrinciple(user);
        }
    }
}
