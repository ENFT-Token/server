# ENFT Server

## Usage

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
> nest start:dev
```
