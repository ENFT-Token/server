# ENFT Server

## Usage

- Require File

  - keystore.json

- MaraDB 실행

```sh
> docker-compose up -d
```

- MariaDB Shell 접속

초기 비밀번호 `password`

```sh
> docker ps -a # mariaDB 컨테이너 아이디 찾기
> docker exec -ti ${container_id} /bin/mysql -u root -p
```

- API Server 실행

```sh
> yarn install
> yarn start:dev
```

- .env 설정
  해당 값은 선규에게 문의

```sh
KAS_PUBLIC_ACCESS_KEY= # kas public api key
KAS_PRIVATE_ACCESS_KEY= # kas private api key
JWT_SECRET_KEY= # jwt key
KAS_PASSWORD = # kas keystore.json password
CONTRACT_ADDRESS=0x52307bf84bbDB1A3C42F46f2D2417Fd8ea756695
```
