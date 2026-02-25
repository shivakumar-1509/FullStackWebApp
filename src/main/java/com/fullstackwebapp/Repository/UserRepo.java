package com.fullstackwebapp.Repository;

import com.fullstackwebapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User,String> {

    User findByUsername(String username);
}
