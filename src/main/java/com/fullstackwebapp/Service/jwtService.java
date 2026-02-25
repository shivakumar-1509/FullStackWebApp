package com.fullstackwebapp.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;

public class jwtService {

    private final String secretKey;

    public jwtService(String secretKey) {
        this.secretKey = secretKey;
    }

    public String generateSecretKey(){
        try{
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        }
        catch(NoSuchAlgorithmException e){
            throw new RuntimeException("Error generating secret key");
        }
    }

    public String generateToken(String username){
        Map<String>
    }
}
