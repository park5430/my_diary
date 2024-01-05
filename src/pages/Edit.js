import {useContext, useEffect} from "react";
import {useNavigate,useParams} from "react-router-dom";
import useDiary from "../hooks/useDiary";
import Button from "../component/Button";
import Header from "../component/Header";
import {DiaryDispatchContext} from "../App";
import Editor from "../component/Editor";
import { setPageTitle } from "../util";

const Edit = () => {
    const {id} = useParams();
    const data = useDiary(id);
    const navigate = useNavigate();
    const {onUpdate, onDelete} = useContext(DiaryDispatchContext);

    useEffect(() => {
        setPageTitle("일기고치는 곳이네")
      }, []);

const onSubmit = (data) => {
    if (window.confirm("일기를 진짜 수정할까요?")) {
        const {date, content, emotionId} = data;
        onUpdate(id, date, content, emotionId);
        navigate("/", {replace: true});
    }
}

    const onClickDelete = () => {
        if (window.confirm("일기를 진짜 삭제할까요? 복구되지 않습니다!!")) {
            onDelete(id);
            navigate("/", {replace: true});
        }
    }

    const goBack = () => {
        navigate(-1);
      }

    if (!data) {
        return <div>일기를 불러오고 있습니다</div>
    }
    else {
        return (<div>
            <Header title={"일기수정하기"}
            leftChild={<Button text={"< 뒤로가기"} onClick={goBack} />}
            rightChild={<Button type={"negative"} text={"삭제하기"}
            onClick={onClickDelete} />}
            />
            <Editor initData={data} onSubmit = {onSubmit} />
        </div>)
    }
   
};
export default Edit;