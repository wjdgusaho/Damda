    package com.b210.damda.domain.entity.User;

    import com.b210.damda.domain.dto.User.UserDTO;
    import lombok.*;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import javax.persistence.*;
    import java.time.LocalDateTime;

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
        private int coin = 5000;
        @Builder.Default
        @Column(nullable = false, columnDefinition = "integer default 0")
        private int nowTheme = 1;
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

        public User(Long userNo, String accountType, String email, String userPw, String nickname, String profileImage, int coin, int nowTheme, LocalDateTime registDate, LocalDateTime deleteDate, int maxCapsuleCount, int nowCapsuleCount) {
            this.userNo = userNo;
            this.accountType = accountType;
            this.email = email;
            this.userPw = userPw;
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.coin = coin;
            this.nowTheme = nowTheme;
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
                    .nowTheme(this.nowTheme)
                    .maxCapsuleCount(this.maxCapsuleCount)
                    .nowCapsuleCount(this.nowCapsuleCount)
                    .build();
        }


    }
