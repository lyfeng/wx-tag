package com.wxtag.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Base64;

/**
 * JWT工具类
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;
    
    // 获取签名密钥
    private Key getSigningKey() {
        // 确保密钥长度足够安全 (至少256位)
        return Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }
    
    // 为了保持密钥一致性，使用单例模式
    private Key signingKey;
    
    private synchronized Key getOrCreateSigningKey() {
        if (signingKey == null) {
            // 尝试从配置的secret创建一个安全的密钥
            // 如果配置的secret不够长，则创建新的安全密钥
            try {
                byte[] decodedKey = Base64.getDecoder().decode(secret);
                // 确保密钥长度至少为32字节(256位)
                if (decodedKey.length >= 32) {
                    signingKey = Keys.hmacShaKeyFor(decodedKey);
                } else {
                    signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
                }
            } catch (Exception e) {
                // 如果解码失败，创建新的安全密钥
                signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            }
        }
        return signingKey;
    }

    /**
     * 生成token
     */
    public String generateToken(String openId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(openId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getOrCreateSigningKey())
                .compact();
    }

    /**
     * 从token中获取openId
     */
    public String getOpenIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getOrCreateSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    /**
     * 验证token是否有效
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getOrCreateSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查token是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getOrCreateSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
} 