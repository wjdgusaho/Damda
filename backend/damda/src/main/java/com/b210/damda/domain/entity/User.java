    package com.b210.damda.domain.entity;

    import com.b210.damda.domain.dto.UserUpdateDTO;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.ToString;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import javax.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Getter
    @ToString
    @Builder
    @EntityListeners(AuditingEntityListener.class)
    public class User {

        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String email;
        private String password;
        private String nickname;
        @Column(name = "create_date")
        @CreatedDate // 생성일자 자동 생성
        private LocalDateTime createDate;
        @Column(name = "update_date")
        @LastModifiedDate // 수정일자 자동 생성
        private LocalDateTime updateDate;

        public User() {
        }

        public User(Long id, String email, String password, String nickname, LocalDateTime createDate, LocalDateTime updateDate) {
            this.id = id;
            this.email = email;
            this.password = password;
            this.nickname = nickname;
            this.createDate = createDate;
            this.updateDate = updateDate;
        }

        public void updatePassword(String newPassword) {
            this.password = newPassword;
        }

        public void updateNickname(String newNickname) {
            this.nickname = newNickname;
        }
    }
