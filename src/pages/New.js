import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import Header from "../component/Header";
import Editor from "../component/Editor";
import {useContext, useEffect} from "react";
import {DiaryDispatchContext} from "../App";
import { setPageTitle } from "../util";
// 새 일기데이터를 "작성완료" 버튼 누르면 일기 데이터가 추가되어야합니다
// App 함수의 onCreate를 호출해서 추가해야 하니까 
// 함수 onCreate를 DiaryDispatchContext에서 불러와야죠

const New = () => {
  useEffect(() => {
    setPageTitle("새일기 쓰는데라 하드라구")
  }, []);
  // 리액트 훅을 사용해서 DiaryDispatchContext를 인수로 받아서
  // onCreate 함수 소환!!
  // 특히 지금 친구를 중괄호로 부르는 이유는 일기 데이터의 구조가
  // json파일 형식의 객체 데이터 형태이기 때문
  const { onCreate} = useContext(DiaryDispatchContext);
  const navigate = useNavigate();
 
  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = (data) => {
    const { date, content, emotionId} = data;
    onCreate(date, content, emotionId);
    navigate("/", {replace: true})
  }

  return (
    <div>
      <Header
        title={"새 일기쓰기"}
        leftChild={<Button text={"< 뒤로가기"} onClick={goBack} />}
      />
      <Editor onSubmit={onSubmit} />
    </div>
  );
};
export default New;
