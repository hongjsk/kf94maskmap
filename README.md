# KF94 Mask Map
이 애플리케이션은 Node.js 를 기반으로 작성된 KF94 마스크 조회 애플리케이션 예제입니다. IBM Cloud Lite 계정을 이용하면 무료로 256MB 메모리의 Cloud Foundry 계정과 주요 서비스를 별도 과금없이 사용 할 수 있습니다. 관련 부분은 [IBM Cloud Lite 계정 정보](https://www.ibm.com/kr-ko/cloud/lite-account)를 참고 하세요.

## Demo

다음 링크를 클릭하면 실행 중인 서비스를 확인 할 수 있습니다.

* https://kf94maskmap.au-syd.cf.appdomain.cloud/

## 사전 준비 사항

* IBM Cloud 계정 (https://cloud.ibm.com/registration)
* IBM Cloud CLI (https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-install-ibmcloud-cli)
* Git 클라이언트 (https://git-scm.com/downloads)
* Node.js 런타임 (https://nodejs.org/ko/download/)

## 1단계: 애플리케이션 복제

명령창이나 Git Bash를 실행하고 다음 명령으로 프로젝트 코드를 개인 PC환경으로 복제합니다.

``` bash
git clone https://github.com/hongjsk/kf94maskmap.git
```

## 2단계: 복제된 애플리케이션 실행

개인 PC 환경으로 정상적으로 복제되었다면 `kf94maskmap` 이라는 디렉토리가 생성됩니다. 해당 디렉토리로 이동하여 애플리케이션이 사용하는 Node 패키지를 설치합니다.

### 디렉토리 변경

``` bash
cd kf94maskmap
```

### 의존성 패키지 설치

``` bash
npm install
```

### 애플리케이션 실행

``` bash
npm start
```

### 웹브라우저에서 확인

http://localhost:3000 경로에서 아래와 같은 화면이 나타나는지 확인합니다.

![Request Current Location Popup](images/request-location-popup.png)

`허용`을 클릭하면 현재 위치를 기준으로 한 위도, 경도 정보를 기반으로 지도가 표시됩니다.

![Screenshot](images/screenshot.png)

마우스를 클릭하면 해당 지점 반경 1km 이내에 공적 마스크 판매 지점 정보가 재고 수량에 따라 다른 색으로 표시됩니다.

![Makers](images/markers.png)

* 100개 이상 보유는 초록색
* 30~100개 보유는 주황색
* 30개 이하는 빨간색
* 재고가 없는 경우는 검정색으로 표시됩니다.

![Markers with legend](images/markers-with-legend.png)

마커를 선택하면 해당 판매처의 상호와 입고 시간, 업데이트 시간 그리고 주소가 표시됩니다.

![Marker Selected](images/marker-selected.png)

화면 상단의 선택 상자를 이용하면 재고 수량에 따른 상태를 선택하여 화면에 표시할 수 있습니다.

![Marker Group](images/marker-groups.png)

## 3단계: 애플리케이션 배포 준비

개인 PC에서 정상적으로 실행되는 것을 확인했다면 IBM Cloud에 배포할 준비를 하니다. 이 애플리케이션은 IBM Cloud의 PaaS 플랫폼인 Cloud Foundry에 배포가 가능합니다. 디렉토리에 있는 `manifest.yml` 파일을 열어 정보를 확인 합니다.

``` yaml
---
applications:
 - name: kf94maskmap
   random-route: true
   memory: 64M
```

애플리케이션 이름이 `kf94maskmap` 가 되고 route 경로는 `kf94maskmap`가 포함된 형태로 임의로 지정됩니다. 변경을 원하면 `name` 항목을 수정합니다.

## 4단계: 애플리케이션 배포

이제 IBM Cloud로 배포를 진행합니다.

### IBM Cloud 로그인

명령창에서 다음 명령으로 IBM Cloud에 로그인 합니다.

``` bash
ibmcloud login
```

만약, IBM Cloud 계정이 Federation 계정인 경우 `--sso` 옵션을 이용할 수 있습니다.

``` bash
ibmcloud login --sso
```

### Cloud Foundry 조직을 선택

``` bash
ibmcloud target --cf
```

만약 Cloud Foundry 조직(Organization)이나 영역(Workspace)이 없는 없는 경우라면, 웹 브라우저를 이용하여 IBM Cloud 대시보드에 접속합니다.

* 화면 오른쪽 상단 메뉴 중 `관리` > `계정`을 선택 하여 계정 화면으로 이동
* `계정 리소스 > Cloud Foundry 조직`으로 진입
* `작성` 버튼을 클릭하여 조직을 작성

이미 조직이 생성되어 있는 경우라면 해당 링크를 클릭하여 `영역` 탭으로 진입합니다. 만약 영역이 없다면 `영역 추가` 버튼을 클리하여 새로운 영역을 조직에 생성합니다.

보다 자세한 내용은 [이곳](https://cloud.ibm.com/docs/account?topic=account-orgsspacesusers)을 참고하시기 바랍니다.

### Cloud Foundry 애플리케이션 배포

`kf94maskmap` 디렉토리에서 다음 명령으로 애플리케이션을 배포합니다.

``` bash
ibmcloud cf push
```

정상적으로 배포가 되었다면 다음과 유사한 메시지가 출력됩니다.

``` bash
% ibmcloud cf push
'cf push' 호출 중...

Manifest에서 hongjsk(으)로 hongjsk 조직/dev 영역에 푸시 중...
Manifest 파일 /Volumes/Works/Project/kf94maskmap/manifest.yml 사용
앱 정보를 가져오는 중...
이러한 속성의 앱 작성 중...
+ 이름:     kf94maskmap
  경로:     /Volumes/Works/Project/kf94maskmap
+ 메모리:   64M
  라우트:
+   kf94maskmap-boring-topi.au-syd.mybluemix.net

kf94maskmap 앱 작성 중...
라우트 맵핑 중...
로컬 파일을 원격 캐시와 비교 중...
Packaging files to upload...
파일 업로드 중...
 128.76 KiB / 128.76 KiB [===============================================================================================================================================] 100.00% 3s

API의 파일 처리가 완료되기를 기다리는 중...

앱 스테이징 및 로그 추적 중...
   Downloading sdk-for-nodejs_v4_2-20200227-1649...
   Downloading staticfile_buildpack...
   Downloading dotnet-core...
   Downloading liberty-for-java...

...

앱이 시작되기를 기다리는 중...

이름:                  kf94maskmap
요청된 상태:           started
라우트:                kf94maskmap-boring-topi.au-syd.mybluemix.net
마지막으로 업로드함:   Fri 13 Mar 01:10:32 KST 2020
스택:                  cflinuxfs3
빌드팩:                sdk-for-nodejs

유형:          web
인스턴스:      1/1
메모리 사용:   64M
시작 명령:     npm start
     상태      이후                   CPU    메모리       디스크    세부사항
#0   실행 중   2020-03-12T16:10:52Z   0.0%   40K / 64M   8K / 1G   

```

### Cloud Foundry 애플리케이션 배포 확인

다음 명령으로 애플리케이션 배포 상태를 확인 합니다.

``` bash
ibmcloud cf apps
```

그러면 다음과 같이 애플리케이션 상태를 확인 할 수 있습니다.

``` bash
% ibmcloud cf apps                                    
'cf apps' 호출 중...

hongjsk(으)로 hongjsk 조직/dev 영역의 앱 가져오는 중...
확인

이름                      요청된 상태   인스턴스   메모리   디스크   URL
kf94maskmap               started       2/2        64M      1G       kf94maskmap-boring-topi.au-syd.mybluemix.net
```

## 5단계: 애플리케이션 실행 확인

웹브라우저를 이용하여 배포된 애플리케이션의 URL로 접속하여 개인 PC 환경에서와 같이 정상적으로 동작하는지 확인 합니다.

# 참고

* [IBM Cloud 튜토리얼](https://cloud.ibm.com/docs/tutorials)
* [한국 공공데이터 포털 공적 마스크 API](https://www.data.go.kr/dataset/15043025/openapi.do)
* [Node.js](https://nodejs.org/) : 백엔드 서버 사이드용 오픈소스 JavaScript 런타임 환경
* [Express](https://expressjs.com/) : API 서비스나 웹서버용 JavaScript 웹 프레임워크
* [jQuery]() : HTML DOM이나 이벤트를 조작용 크로스플랫폼 JavaScript 라이브러리
* [Leaflet](https://leafletjs.com/) : Web Mapping용 오픈소스 JavaScript 라이브러리
* [Leaflet Awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers) : 사용자 정의 마커를 위한 확장 플러그인
* [Twitter Bootstrap](https://getbootstrap.com/)


# License

This code pattern is licensed under the Apache Software License, Version 2. Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the Developer Certificate of Origin, Version 1.1 (DCO) and the Apache Software License, Version 2.

Apache Software License (ASL) FAQ