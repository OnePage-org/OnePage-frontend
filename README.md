

# 0. Getting Started (시작하기)
```bash
$ ./gradlew clean build -x test 
$ docker compose up --build -d
```
---->   [서비스 링크](https://coupong.netlify.app/)   <----

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: Coupong
- 프로젝트 설명: 선착순 쿠폰 이벤트 플랫폼

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 진명인 | 백효석 | 심지혜 | 강희준 |
|:------:|:------:|:------:|:------:|
| <img src="https://avatars.githubusercontent.com/myeonginjin" alt="진명인" width="150"> | <img src="https://avatars.githubusercontent.com/alexization" alt="백효석" width="150"> | <img src="https://avatars.githubusercontent.com/sapientia1007" alt="심지혜" width="150"> | <img src="https://avatars.githubusercontent.com/dhfkdlsj" alt="강희준" width="150"> |
| BE | BE | BE | BE |
| [GitHub](https://github.com/myeonginjin) | [GitHub](https://github.com/alexization) | [GitHub](https://github.com/sapientia1007) | [GitHub](https://github.com/dhfkdlsj) |

<br/>
<br/>

# 3. Key Features (주요 기능)
- **인증/인가**:
  - 일반 유저는 쿠폰 이벤트 메인페이지, 관리자는 이벤트 등록 페이지로 이동합니다.  `Security`
  - 카카오톡, 네이버 그리고 플랫폼 자체 로그인 총 3가지의 로그인 방식이 있습니다. `OAuth`

- **쿠폰 이벤트**:
  - 매일 밤 자정, 이벤트 목록이 초기화됩니다.  `스케줄러 동적 할당`
  - 이벤트는 카테고리별로 동일한 날짜, 동일한 시간대에 여러 이벤트가 진행될 수 있습니다.  `멀티 스케줄러`

- **실시간 채팅**:
  - 이벤트가 진행 중이거나 진행 중이지 않을 때에도, 유저끼리 실시간 채팅 서비스를 즐길 수 있습니다.  `Web Soket`
  - 금칙어 필터링 시스템이 실시간으로 부적절한 챗 메시지를 잡아냅니다. 허용어는 예외처리하고 우회단어는 금칙어와 동일하게 잡아냅니다.  `아호-코라식`

- **리더보드**:
  - 쿠폰 이벤트에 당첨된 사람은 실시간으로 리더보드에 등록됩니다.  `SSE`
  - 이벤트 카테고리별로 당첨자들의 순위를 매깁니다. 기준은 발행 요청 시각입니다.  `Sorted Set`

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
|-----------------|-----------------|-----------------|
| 진명인    |  <img src="https://avatars.githubusercontent.com/myeonginjin" alt="진명인" width="100"> | <ul><li>프로젝트 기획 및 리딩</li><li>인프라 구축 (WAS)</li><li>쿠폰 이벤트 시스템</li><li>금칙어 필터링 시스템</li></ul>     |
| 백효석   |  <img src="https://avatars.githubusercontent.com/alexization" alt="백효석" width="100">| <ul><li>인증/인가 시스템</li><li>서버 부하 테스트</li><li>금칙어 필터링 시스템</li></ul> |
| 심지혜   |  <img src="https://avatars.githubusercontent.com/sapientia1007" alt="심지혜" width="100">    |<ul><li>실시간 채팅 시스템</li><li>개발 문서 정리</li><li>QA</li></ul>  |
| 강희준    |  <img src="https://avatars.githubusercontent.com/dhfkdlsj" alt="강희준" width="100">    | <ul><li>리더보드 시스템</li><li>인프라 구축 (Web Server)</li><li>QA</li></ul>    |

<br/>


# 5. Technology Stack (기술 스택)
## 5.1 Backend
|  |  |
|-----------------|-----------------|
| JAVA          |<img src="https://github.com/user-attachments/assets/5df80afe-5c3d-47c1-9f6d-1549d1b2fc42" alt="JAVA" width="200">| 
| Spring Boot   |   <img src="https://github.com/user-attachments/assets/4d0c279a-0dfe-4253-b79e-c615935f9aff" alt="Spring Boot" width="200">|
| Spring Security   |   <img src="https://github.com/user-attachments/assets/f4744195-f1d0-44d9-b64c-0a027aaaf05a" alt="Spring Security" width="200">|
| JUnit   |   <img src="https://github.com/user-attachments/assets/d611f4a1-1d10-46a5-a83f-0048c3dfb776" alt="JUnit" width="200">|
<br/>

## 5.2 Frotend
|  |  |  |
|-----------------|-----------------|-----------------|
| React    |  <img src="https://github.com/user-attachments/assets/e3b49dbb-981b-4804-acf9-012c854a2fd2" alt="React" width="100"> | latest    |
| CSS3    |   <img src="https://github.com/user-attachments/assets/c531b03d-55a3-40bf-9195-9ff8c4688f13" alt="CSS3" width="100">| latest    |
| Javascript    |  <img src="https://github.com/user-attachments/assets/4a7d7074-8c71-48b4-8652-7431477669d1" alt="Javascript" width="100"> | latest    |
<br/>

## 5.3 DBMS
|  |  |  |
|-----------------|-----------------|-----------------|
| Redis    |  <img src="https://github.com/user-attachments/assets/5de8138b-f2c4-4f72-ac54-3266f6e9b257" alt="Redis" width="100">    | latest   |
| MySQL    |  <img src="https://github.com/user-attachments/assets/19757339-cd0f-4388-8129-5476409dd88c" alt="Redis" width="100">    | latest   |
<br/>

## 5.3 Infra
|  |  |  
|-----------------|-----------------|
| AWS    |  <img src="https://github.com/user-attachments/assets/0ec812d8-6256-425a-bbf4-797b5a0c5c49" alt="AWS" width="100">    
| Docker    |  <img src="https://github.com/user-attachments/assets/14027b7d-6e68-4918-8a01-ac2ba9e9778a" alt="Docker" width="100">
| Stomp    |  <img src="https://github.com/user-attachments/assets/83021a64-e5e1-4e6e-9ef0-b18f03c8cbd8" alt="Stomp" width="150">
| SSE    |  <img src="https://github.com/user-attachments/assets/260c5ab4-9d43-4edc-ab45-3fed9d61e8c2" alt="SSE" width="150">
<br/>

## 5.4 Cooperation
|  |  |
|-----------------|-----------------|
| Git    |  <img src="https://github.com/user-attachments/assets/483abc38-ed4d-487c-b43a-3963b33430e6" alt="git" width="100">    |
| Figma    |  <img src="https://github.com/user-attachments/assets/aa07f6bc-5034-4461-babf-82ada48f36b0" alt="Figma" width="100">    |
| Notion    |  <img src="https://github.com/user-attachments/assets/34141eb9-deca-416a-a83f-ff9543cc2f9a" alt="Notion" width="100">    |

<br/>

# 6. Project Structure (프로젝트 구조)
```plaintext
main
└── java
    └── com
        └── onepage
            └── coupong
                ├── chat
                └── coupon
                    ├── api
                    ├── config
                    ├── domain
                    ├── dto
                    ├── exception
                    ├── repository
                    └── service
                ├── global
                ├── infrastructure
                ├── leaderboard
                └── user
└── CoupongApplication
resources
test
└── java
    └── com
        └── onepage
            └── coupong
                └── couponEventTest
                    ├── CouponEventSchedulerTest.java
                    ├── CouponEventServiceIntegrationTest
                    └── CoupongApplicationTests
```

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)
우리의 브랜치 전략은 Git Flow를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.

- main
  - 배포 가능한 상태의 코드를 유지합니다.
  - 모든 배포는 이 브랜치에서 이루어집니다.
  
- develop/{feature/release/refactoring...}
  - 팀원 각자의 개발 브랜치입니다.
  - 모든 기능 개발은 이 브랜치에서 이루어집니다.

<br/>
<br/>

# 8. ERD
<img src="https://github.com/user-attachments/assets/25b6826f-99bc-4573-855c-c795f7f8dc47" alt="React" width="500"> <br/><br/>

# 9. 시스템 아키텍처
<img src="https://github.com/user-attachments/assets/c4d06585-0d93-481e-b14c-81b70ae594c3" alt="React" width="500"> <br/><br/>

# 10. 인터페이스 설계
<img src="https://github.com/user-attachments/assets/6e6238ea-3994-4eec-a1ad-d533b26a8971" alt="React" width="300">
<img src="https://github.com/user-attachments/assets/0516008c-7991-4cd5-b089-daac5b4611aa" alt="React" width="300">
<img src="https://github.com/user-attachments/assets/6185929c-0a1a-4250-94b8-d776ab0eca7c" alt="React" width="500"> <br/><br/>

# 11. 인증•인가 플로우
<img src="https://github.com/user-attachments/assets/8e286e17-370a-4f67-b3cc-0e4ae29ed673" alt="React" width="300"> <br/><br/>

# 12. 쿠폰 이벤트 시스템 프로세스
<img src="https://github.com/user-attachments/assets/4a5bf147-cd63-4eb0-97c6-f8fcffd91fa2" alt="React" width="500"> <br/><br/>

# 13. 금칙어 필터링 시스템 프로세스
<img src="https://github.com/user-attachments/assets/8df53e98-8da1-46fe-8830-e8914b587fb6" alt="React" width="500"> 
<img src="https://github.com/user-attachments/assets/187da3cf-ffdc-47ed-beb5-1211146bfa4f" alt="React" width="500"> 



