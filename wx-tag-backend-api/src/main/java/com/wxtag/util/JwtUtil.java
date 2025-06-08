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
    
    /**
     * 获取签名密钥
     * 使用固定的secret确保应用重启后密钥保持一致
     */
    private Key getSigningKey() {
        try {
            // 如果配置的secret是Base64编码的，尝试解码
            if (secret.length() > 32) {
                try {
                    byte[] decodedKey = Base64.getDecoder().decode(secret);
                    if (decodedKey.length >= 32) {
                        return Keys.hmacShaKeyFor(decodedKey);
                    }
                } catch (Exception e) {
                    // Base64解码失败，按照普通字符串处理
                }
            }
            
            // 如果secret长度不够，则填充到足够的长度
            String fixedSecret = secret;
            while (fixedSecret.length() < 64) {
                fixedSecret += fixedSecret + "WxTagJwtSecret2024";
            }
            
            // 截取前64个字符确保长度一致
            fixedSecret = fixedSecret.substring(0, 64);
            
            // 使用固定的secret创建密钥
            return Keys.hmacShaKeyFor(fixedSecret.getBytes(StandardCharsets.UTF_8));
            
        } catch (Exception e) {
            // 如果出现任何异常，使用默认固定secret
            String defaultSecret = "WxTagJwtSecretKey2024ForProductionUseOnlyDoNotChangeThisKey";
            return Keys.hmacShaKeyFor(defaultSecret.getBytes(StandardCharsets.UTF_8));
        }
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
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 从token中获取openId
     */
    public String getOpenIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
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
                .setSigningKey(getSigningKey())
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
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
} 