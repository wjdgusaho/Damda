    package com.b210.damda.domain.entity;

    import com.b210.damda.domain.dto.UserUpdateDTO;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.ToString;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;
    import reactor.util.annotation.Nullable;

    import javax.persistence.*;
    import java.sql.Timestamp;
    import java.time.LocalDateTime;

    @Entity
    @Getter
    @ToString
    @Builder
    public class User {

        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long userNo;
        @Column(nullable = false)
        private String accountType;
        @Column(nullable = false, unique = true)
        private String email;
        @Column(nullable = false)
        private String userPw;
        private String nickname;
        private String profileImage;
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int coin;
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int nowThema;
        @Column(nullable = false, columnDefinition = "timestamp default now()")
        private LocalDateTime recentLogin;
        @Column(nullable = false, columnDefinition = "integer default 5")
        private int maxCapsuleCount;
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int nowCapsuleCount;


        public User() {
        }

        public User(Long userNo, String accountType, String email, String userPw, String nickname, String profileImage, int coin, int nowThema, LocalDateTime recentLogin, int maxCapsuleCount, int nowCapsuleCount) {
            this.userNo = userNo;
            this.accountType = accountType;
            this.email = email;
            this.userPw = userPw;
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.coin = coin;
            this.nowThema = nowThema;
            this.recentLogin = recentLogin;
            this.maxCapsuleCount = maxCapsuleCount;
            this.nowCapsuleCount = nowCapsuleCount;
        }

        public void updatePassword(String userPw) {
            this.userPw = userPw;
        }

        public void updateNickname(String newNickname) {
            this.nickname = newNickname;
        }
    }
