const API_URL = "https://52.78.184.202:8080";

// 개발/테스트용 Mock 모드 (true로 설정하면 API 호출 없이 테스트 가능)
const USE_MOCK = false;

const headers = {
  "Content-Type": "application/json",
};

// ===== Mock 데이터 =====
const mockData = {
  login: {
    isSuccess: true,
    code: 200,
    message: "로그인 성공",
    result: {
      userId: 1,
      name: "테스트 사용자",
      sessionId: 1,
    },
  },
  familyLogin: {
    isSuccess: true,
    code: 200,
    message: "로그인 성공",
    result: {
      userId: 1,
      lists: [1, 2, 3],
    },
  },
  getData: {
    isSuccess: true,
    code: 200,
    message: "월간 리포트 조회 성공",
    result: {
      targetMonth: "2026-01",
      totalPlayCount: 15,
      summary: {
        avgTotalScore: 72,
        riskLevel: 1, // 0: 정상, 1: 주의, 2: 위험
        scoreChange: 7,
        comment:
          "전반적인 인지 기능은 안정적이나, 새로운 과제에 대한 실행 지연이 관찰됩니다.",
      },
      currentRadar: {
        accuracy: 85,
        stability: 75,
        execution: 60,
        inhibition: 88,
        efficiency: 70,
      },
      previousRadar: {
        accuracy: 80,
        stability: 70,
        execution: 55,
        inhibition: 82,
        efficiency: 68,
      },
      scoreTrend: [65, 68, 72, 70, 75],
    },
  },
  saveAnswer: {
    isSuccess: true,
    code: 200,
    message: "정답 저장 성공",
    result: {
      questionId: 1,
    },
  },
  submitData: {
    isSuccess: true,
    code: 200,
    message: "답변 제출 성공",
    result: {},
  },
  getGameResults: {
    isSuccess: true,
    code: 200,
    message: "결과 조회 성공",
    result: {
      totalScore: 78,
      agility: 82,
      judgment: 74,
      graph: [70, 75, 80, 85, 78],
    },
  },
};

// ===== API 함수 =====

// 시니어 로그인
async function login(data) {
  if (USE_MOCK) {
    console.log("[Mock] login:", data);
    return {
      ...mockData.login,
      result: { ...mockData.login.result, name: data.name },
    };
  }

  const res = await fetch(API_URL + `/users/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await res.json();
}

// 보호자 로그인
async function familyLogin({ guardianId }) {
  if (USE_MOCK) {
    console.log("[Mock] familyLogin:", guardianId);
    return mockData.familyLogin;
  }

  const res = await fetch(API_URL + `/family/login/${guardianId}`, {
    method: "GET",
    headers,
  });
  return await res.json();
}

// 보호자 개별 리포트 조회
async function getData({ userId, month_ }) {
  if (USE_MOCK) {
    console.log("[Mock] getData:", userId, month_);
    return mockData.getData;
  }

  const res = await fetch(API_URL + `/family/${userId}/reports/${month_}`, {
    method: "GET",
    headers,
  });
  return await res.json();
  //   {
  //   "isSuccess": true,
  //   "code": 200,
  //   "message": "월간 리포트 조회 성공",
  //   "result": {
  //     "targetMonth": "2026-01",
  //     "totalPlayCount": 15,
  //     "summary": {
  //       "avgTotalScore": 72,
  //       "riskLevel": 1,        // 0: 정상, 1: 주의, 2: 위험
  //       "scoreChange": 7,
  //       "comment": "전반적인 인지 기능은 안정적이나, 새로운 과제에 대한 실행 지연이 관찰됩니다."
  //     },
  //     "currentRadar": {          // 오각형 그래프용 (모두 100점 만점 환산 점수)
  //       "accuracy": 85,        // 정확도
  //       "stability": 75,       // 안정성 (변동성 보정 점수)
  //       "execution": 60,       // 실행력 (첫 클릭 지연 보정 점수)
  //       "inhibition": 88,      // 억제력 (중복 클릭 방지 점수)
  //       "efficiency": 70       // 효율성 (경로 일관성 점수)
  //     },
  //     "previousRadar": {       // 지난달 오각형 데이터 (프론트에서 겹쳐 그리기용)
  //       "accuracy": 80,
  //       "stability": 70,
  //       "execution": 55,
  //       "inhibition": 82,
  //       "efficiency": 68
  //     },
  //     "scoreTrend": [65, 68, 72, 70, 75] // 꺾은선 그래프용 (최근 5회 또는 주차별)
  //   }
  // }
}

// 관리자 - 정답 저장
async function saveAnswer(data) {
  if (USE_MOCK) {
    console.log("[Mock] saveAnswer:", data);
    return mockData.saveAnswer;
  }

  const res = await fetch(`${API_URL}/staff/answers`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await res.json();
}

// 사용자 답변 제출
async function submitData({ sessionId, questionNum, data }) {
  if (USE_MOCK) {
    console.log("[Mock] submitData:", sessionId, questionNum, data);
    return mockData.submitData;
  }

  const res = await fetch(
    API_URL + `/users/${sessionId}/${questionNum}/answers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    },
  );
  return await res.json();
}

// 사용자 게임 결과 확인
async function getGameResults({ sessionId }) {
  if (USE_MOCK) {
    console.log("[Mock] getGameResults:", sessionId);
    return mockData.getGameResults;
  }

  const res = await fetch(API_URL + `/users/${sessionId}/result`, {
    method: "GET",
    headers,
  });
  return await res.json();
}
