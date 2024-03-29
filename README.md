<h2 align="center">
  SIGNIFY<br/>
  <a href="https://soumyajit.vercel.app/" target="_blank">수화학습 도우미</a>
</h2>
<div align="center">
  <img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/2ca1b1a7-d510-4509-8874-e695d5ad12a6">
</div>

<br/>


# 1.기술 스택
- ML : Python, Mediapipe, scikit-learn(randomforest)
- Frontend : React
- Backend : python, Flask


## 1-1. ML 파트
데이터 생성 -> mediapipe를 이용한 feature 추출-> scikit-learn의 randomforest라는 모델을 이용해 학습 ->  model의 predict method를 이용해 웹캠으로 입력받은 feature의 특징을 바탕으로 예측값 출력

1. 26자의 알파벳 별 해당하는 수화사진을 여러 사이즈와 각도로 100장의 사진을 직접 찍은 주었고 mediapipe lib를 이용해 손락 마디의 위치정보과 각도 정보를 추출하여 pickdata로 변환해 주었다. pickle data는 파이썬 파일을 바이트 단위로 직렬화 하여 데이터를 저장함으로써 용량이 큰 데이터에 대해 파일 전송이나 ML 학습을 할 때 데이터 손실을 최대한 줄일 수 있는 장점이 있습니다.

2. python에서 제공하는 ML 학습 모델인 RandomForestClassifier을 이용해 모델을 학습해주었습니다.
random forest classifier : 데이터를 훈련과정에서 중복을 허용한 뒤 랜덤하게 구성한 다수의 결정 트리들을 학습시켜 과적합 현상을 줄이고 정확도를 높이고자 하였습니다. 이 모델은 주로 분류, 회귀 문제에 적합한 학습모델입니다.
3. 웹캠에서 입력받은 이미지 프레임의 mediapipe 정보를 가지고 model이 예측한 값을 반환해 주도록 하였습니다. 


## 1-2. Websocket 파트
KAIST에서 제공한 Kcloud VM 환경에서 Flask 서버를 구축했으며 실시간 통신 기술을 사용하기 위해 서버는 웹소켓을 이용한 양방향 통신 체계로 구축되었습니다. 클라이언트에서 프레임 단위로 소켓을 통해 서버에게 이미지 데이터를 전송합니다. 서버에서는 학습된 모델을 기반으로 수신받은 이미지를 분석, 모델에 의해 예측한 알파벳 결과를 소켓을 통해 클라이언트에게 전송합니다.

# 2. 기능 소개
## 2-1. 초기화면
초기화면에서 start를 눌러서 왼손잡이인지 오른손잡이인지 선택하도록 하였습니다. 왼손잡이, 오른손잡이 컴포넌트들은 애니메이션을 주어 각각 위, 아래에서 나타나도록 하였습니다.
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/d03be526-3924-48a6-b9bd-86e3a4458ebd">

## 2-2. level 선택
오른손잡이를 선택하면 level을 선택하는 page로 들어가게 된다. level은 3가지로 구성되어 있으며 level1은 알파벳지문자를 낱개로 학습할 수 있도록 하였고, level2와 level3는 헷갈리기 쉬운 알파벳 지문자와 단어의 길이를 조절함으로써 난이도를 조절하였습니다.
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/4c74c64d-0e5a-4daf-814e-2c1f2b38724e">

## 2-3. 학습 페이지
level2로 들어가게 되면 학습할 단어가 Modal 창으로 3초간 뜨게 하였고 학습해야할 단어 중 몇 번째에 해당하는지 표시해 주었습니다. 
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/4654d79d-94ba-45a1-a437-e3941e10b8d2">

Modal창이 사리진 뒤 해당 단어가 표시되고 단어 중 학습해야 될 알파벳이 손이미지와 함께 다른 색깔로 표시됩니다. 정답을 맞출때까지 다음창으로 넘어가지 않도록 설계하였으며, skip 버튼을 통해 어려운 손동작은 넘어가게 설계하였습니다. 마지막 단어까지 풀게되면 정확하게 맞춘 알파벳의 갯수를 전체 단어의 갯수 나누어 점수를 띄워주었습니다.

- 정답을 맞추었을때
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/dd396eff-5b89-41d9-b94a-2d33a3fe5779">

- 양손 나왔을 때 경고 문구
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/ba421d09-efbb-4ad9-a0c7-fff702eb1151">

- 점수 페이지
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/e0ae553f-8daa-4f72-b6ba-91e2001f6994">

- 왼손 페이지
<img src="https://github.com/jiminijr/Madcamp_4th_week_FE/assets/154505487/0b378119-0ae2-42f9-808e-8533f31f5331">


# 3. 참여자
- 한양대학교 컴퓨터소프트웨어학부 김선오
- DGIST 전기전자컴퓨터공학과 윤현서
- 성균관대학교 컬쳐앤테크놀로지융합전공 최지민
