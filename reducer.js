function reducer(appState, store, action) {
  switch (action.type) {
    // ===== Admin Flow =====
    case ACTIONS.GO_ADMIN:
      return { nextState: STATES.ADMIN };

    case ACTIONS.ADD_ADMIN_CLICK:
      // 관리자가 정답 클릭 추가
      const newAdminClick = {
        id: store.adminAnswers.length + 1,
        x: action.x,
        y: action.y,
      };
      return {
        patch: {
          adminAnswers: [...store.adminAnswers, newAdminClick],
        },
      };

    case ACTIONS.REMOVE_ADMIN_CLICK:
      // 관리자가 정답 클릭 제거 (클릭한 위치 근처의 마커 삭제)
      const filtered = store.adminAnswers.filter((ans) => {
        const dx = ans.x - action.x;
        const dy = ans.y - action.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist > 0.05; // 5% 반경 밖의 것만 유지
      });
      return {
        patch: {
          adminAnswers: filtered.map((ans, i) => ({ ...ans, id: i + 1 })),
        },
      };

    case ACTIONS.ADMIN_NEXT_STAGE:
      // 정답 저장 후 다음 스테이지로 (API 호출은 Scene에서 처리)
      const nextAdminStage = store.currentAdminStage + 1;
      if (nextAdminStage > CONFIG.TOTAL_STAGE) {
        // 마지막 스테이지면 user 화면으로
        return { nextState: STATES.SELECT_USER };
      }
      return {
        patch: {
          currentAdminStage: nextAdminStage,
          adminAnswers: [],
        },
      };

    // ===== User Selection =====
    case ACTIONS.SELECT_USER:
      return { nextState: STATES.SELECT_USER };

    case ACTIONS.CLICK_SENIOR:
      return { nextState: STATES.SENIOR_LOGIN };

    case ACTIONS.CLICK_FAMILY:
      return { nextState: STATES.FAMILY_LOGIN };

    // ===== Senior Game Flow =====
    case ACTIONS.START_GAME:
      // seniorLogin -> inGame (세션 정보와 함께)
      return {
        nextState: STATES.INGAME,
        patch: {
          sessionId: action.sessionId,
          userId: action.userId,
          nickname: action.nickname,
          level: action.level,
          currentGameStage: 1,
          questionNum: 1,
          userClicks: [],
          questionStartTime: Date.now(),
        },
      };

    case ACTIONS.ADD_CLICK:
      // 게임 중 클릭 추가
      const clickData = {
        clickOrder: store.userClicks.length + 1,
        milisec: Date.now() - store.questionStartTime,
        x: action.x,
        y: action.y,
      };
      return {
        patch: {
          userClicks: [...store.userClicks, clickData],
        },
      };

    case ACTIONS.NEXT_QUESTION:
      // 다음 문제로 (API 제출은 Scene에서 처리)
      return {
        patch: {
          currentGameStage: store.currentGameStage + 1,
          questionNum: store.questionNum + 1,
          userClicks: [],
          questionStartTime: Date.now(),
        },
      };

    case ACTIONS.FINISH_GAME:
      // 게임 완료 -> 결과 화면
      return {
        nextState: STATES.RESULT,
        patch: {
          gameResult: action.result, // { totalScore, agility, judgment, graph }
        },
      };

    case ACTIONS.RETRY_GAME:
      // 다시하기 -> seniorLogin
      return {
        nextState: STATES.SENIOR_LOGIN,
        patch: {
          sessionId: null,
          userClicks: [],
          gameResult: null,
        },
      };

    // ===== Family Report Flow =====
    case ACTIONS.FAMILY_LOGIN:
      // familyLogin -> reportList
      return {
        nextState: STATES.REPORT_LIST,
        patch: {
          guardianId: action.guardianId,
          userId: action.userId,
          monthLists: action.monthLists,
        },
      };

    case ACTIONS.CLICK_REPORT:
      // 특정 월 선택 -> reportDetail
      return {
        nextState: STATES.REPORT_DETAIL,
        patch: {
          selectedMonth: action.month,
          reportData: action.reportData, // { level, graph, comment }
        },
      };

    case ACTIONS.BACK_TO_REPORT_LIST:
      return {
        nextState: STATES.REPORT_LIST,
        patch: {
          selectedMonth: null,
          reportData: null,
        },
      };

    case ACTIONS.BACK_TO_FAMILY_LOGIN:
      return {
        nextState: STATES.FAMILY_LOGIN,
        patch: {
          guardianId: null,
          monthLists: [],
        },
      };

    default:
      console.warn("Unknown action:", action.type);
      return {};
  }
}
