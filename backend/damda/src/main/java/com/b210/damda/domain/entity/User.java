    package com.b210.damda.domain.entity;

    import com.b210.damda.domain.dto.UserDTO;
    import com.b210.damda.domain.dto.UserUpdateDTO;
    import lombok.*;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;
    import reactor.util.annotation.Nullable;

    import javax.persistence.*;
    import java.sql.Timestamp;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;

    @Entity
    @Setter
    @Getter
    @ToString
    @EntityListeners(AuditingEntityListener.class)
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
        @Builder.Default
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int coin = 0;
        @Builder.Default
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int nowThema = 0;
        @CreatedDate
        @Column(nullable = false)
        private LocalDateTime registDate;
        @Column(nullable = true)
        private LocalDateTime deleteDate;
        @Builder.Default
        @Column(nullable = false, columnDefinition = "integer default 5")
        private int maxCapsuleCount = 5;
        @Builder.Default
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int nowCapsuleCount = 0;

        public User() {
        }

        public User(Long userNo, String accountType, String email, String userPw, String nickname, String profileImage, int coin, int nowThema, LocalDateTime registDate, LocalDateTime deleteDate, int maxCapsuleCount, int nowCapsuleCount) {
            this.userNo = userNo;
            this.accountType = accountType;
            this.email = email;
            this.userPw = userPw;
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.coin = coin;
            this.nowThema = nowThema;
            this.registDate = registDate;
            this.deleteDate = deleteDate;
            this.maxCapsuleCount = maxCapsuleCount;
            this.nowCapsuleCount = nowCapsuleCount;
        }

        public void updatePassword(String userPw) {
            this.userPw = userPw;
        }

        public void updateNickname(String newNickname) {
            this.nickname = newNickname;
        }


        public void updateprofileImage(String profileImage){
            this.profileImage = profileImage;
        }

        public void insertDeleteDate() {
            this.deleteDate = LocalDateTime.now();
        }

        public UserDTO toUserDTO(){
            return UserDTO.builder()
                    .userNo(this.userNo)
                    .accountType(this.accountType)
                    .email(this.email)
                    .nickname(this.nickname)
                    .profileImage(this.profileImage)
                    .coin(this.coin)
                    .nowThema(this.nowThema)
                    .maxCapsuleCount(this.maxCapsuleCount)
                    .nowCapsuleCount(this.nowCapsuleCount)
                    .build();
        }


    }
