import { Routes, Route, Link } from "react-router-dom";
// routes는 여러 route컴포넌트를 감쌉니다.
// 그리고 현재 url 경로에 맞게
// 적절한 route 컴포넌트를 페이지에 렌더링 합니다
import React, { useReducer, useRef, useEffect, useState } from "react";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import New from "./pages/New";
import Diary from "./pages/Diary";
import "./App.css";

// 일기 state값 컴포넌트 그룹에 전달할 context를 만듭니다
// 이때 이 컨텍스트를 다른파일(컴포넌트)에서 불러올 수 있게 export
// context사용 시 지나친 페이지 리렌더링 이슈를 막기 위한
// dispatch도 사용을 위해 불러온다
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newState = [action.data, ...state];
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      const newState = state.map((it) =>
        String(it.id) === String(action.data.id) ? { ...action.data } : it
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE": {
      const newState = state.filter(
        (it) => String(it.id) !== String(action.targetId)
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    default: {
      return state;
    }
  }
}

const mockData = [
  {
    id: "mock1",
    date: new Date().getTime() - 1,
    content: "mock1",
    emotionId: 1,
  },
  {
    id: "mock2",
    date: new Date().getTime() - 2,
    content: "mock2",
    emotionId: 2,
  },
  {
    id: "mock3",
    date: new Date().getTime() - 3,
    content: "mock3",
    emotionId: 3,
  },
];

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);
  // 함수 onCreate는 사용자가 선택한 날짜, 입력일기 데이터, 선택한 감정
  // 세가지 데이터를 받아서 저장합니다
  // 상단의 함수 dispatch를 호출하여
  // 데이터는 객체로 저장할 때 타입은 "CREATE"로 합니다
  // 마지막으로 일기를 저장할 때마다 idRef.current +=1 로 id값을
  // 1씩 늘려서 id 데이터가 중복되지 않도록 합니다

  useEffect(() => {
    // 로컬 스토리지로 부터 diary라는 키 값에 저정해 둔 데이터를
    // 불러와서 rawData 변수에 저장합니다
    // 만약에 rawData가 존재하지 않는다면
    // setIsDataLoaded를 true로 업데이트 하고 종료합니다
    // 데이터가 존재하면 JSON객체로 복원합니다
    const rawData = localStorage.getItem("diary");
    if (!rawData) {
      setIsDataLoaded(true);
      return;
    }
    const localData = JSON.parse(rawData);
    if (localData.length === 0) {
      setIsDataLoaded(true);
      return;
    }
    // 불러온 일기 데이터를 id기준 내림차순 정렬 합니다
    // 내림차순 정렬이기에 localData[0] 즉
    // 데이터 배열의 첫 원소는 id 중 가장 큰 값이 됩니다
    // 그렇게 해서 idRef.current 즉, id의 현재값은
    // 일기 id에서 가장 큰 값에 1 더한 값으로 설정합니다
    localData.sort((a, b) => Number(b.id) - Number(a.id));
    idRef.current = localData[0].id + 1;
    dispatch({ type: "INIT", data: localData });
    setIsDataLoaded(true);
  }, []);

  const onCreate = (date, content, emotionId) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    idRef.current += 1;
  };
  const onUpdate = (targetId, date, content, emotionId) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  };
  // 일기 state를 dispatch로 업데이트하는 삭제함수인데 (삭제상태를 업데이트 하다)
  // 변수 targetId로 삭제할 아이디를 저장합니다
  // 일기 객체의 타입으로 삭제를 의미하는 delete와 targetId로 삭제할 일기 id를 저장합니다
  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  };

  if (!isDataLoaded) {
    return <div>아직 데이터를 불러오는 중입니다</div>;
  } else {
    return (
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    );
  }
}

export default App;

// 로컬 스토리지:
// window.localStorage라는 명령어를 사용해서 웹데이터를 저장합니다. 고유 도메인이 바뀌면 기존데이터 접속 불가
// 같은 도메인 주소에서만 데이터 접근 가능 (사용자가 직접 지워야되)
// 세션 스토리지:
// window.SessionStorage라는 명령어로 웹데이터 저장.
// 대신에 브라우저 종료 시 데이터도 삭제된다.
// 새로고침이 발생해도 멀쩡하다

// 데이터 생성/수정하기
// 객체 localStorage에서 setItem호출해서 key & value 전달
// localStorage.setItem("key", value);
// 지금 케이스는 value가 객체일 때 객체를 해석하여 문자열로 변환하는 JSON.stringify메서드를 사용해서 문자열 데이터로 변환하여 사용합니다
// localStorage.setItem("key", JSON.stringify(value));
// 원래 객체 상태로 원복하고 싶다면 아래처럼 써주세요
// const data = JSON.parse(localStorage.getItem("key")
// 이렇게 하면 문자열 데이터를 key값 기준으로 객체상태 원복
// 데이터를 지우려면 아래처럼 써 주세요
// localStorage.removeItem("key")
// 삭제하고픈 데이터의 key값을 인풋으로 넘기면 됩니다.
// 이번엔 세션 스토리지 사용법에 대해 확인해 보시죠
// 로컬스토리지와 사용법 동일. 삭제법도 동일
// sessionStorage.setItem("key", value);
// sessionStorage.setItem("key", JSON.stringify(value));
// sessionStorage.removeItem("key")
