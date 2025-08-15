import { useEffect, useState } from "react";
import { Button, Checkbox, Input, message, Modal, Radio, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  getCategoryList,
  addMyShare,
  myShareDetail,
  modifyMyShare,
} from "@/remote/shareAction";
import { UserInfo } from "@/util/Setting";
import { SaveOutlined } from "@ant-design/icons";
import { SelectValueType } from "../sharemgmt/ShareMain";
import { RadioChangeEvent } from "antd";
import Draggable from "react-draggable";

export default function AddShareInfo(props: any) {
  const { modalHandler, oneRow, isButton } = props;
  const [category, setCategory] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [path, setPath] = useState("");
  const [type, setType] = useState("");
  const [checked, setChecked] = useState(false);
  const [modify, setModify] = useState(false);
  const [pTitle, setPTitle] = useState("");

  useEffect(() => {
    initPopCategoryList({ type: "" });
    if (isButton) {
      setPTitle("[新增]技术分享");
    } else {
      setPTitle("[修改]技术分享");
      initShareDetail();
      setModify(true);
    }
  }, [isButton]);

  async function initShareDetail() {
    const value: any = {};
    value.shareCategoryID = oneRow.shareCategoryID;
    value.shareUserId = oneRow.shareUserId;
    value.shareTitle = oneRow.shareTitle;
    value.nid = oneRow.nid;

    const result = await myShareDetail(value);
    const arr = JSON.parse(result as string);

    const recordList = arr.data;
    if (recordList) {
      recordList.forEach((element: any) => {
        setType(element.type);
        setCategoryID(element.shareCategoryID);
        setTitle(element.shareTitle);
        setChecked(element.toTop === 1 ? true : false);
        setContent(element.shareContent);
        setLink(element.shareLink);
        setPath(element.sharePath);
      });
    }
  }

  async function onSaveBtnClickHander() {
    if (type === "" || categoryID === "000") {
      message.open({ type: "warning", content: "请先选择分类!" });
      return;
    } else if (title === "") {
      message.open({ type: "warning", content: "请填写分享标题!" });
      return;
    } else if (content === "") {
      message.open({ type: "warning", content: "请填写分享内容!" });
    }

    const saveValue: any = {};
    saveValue.shareUserId = UserInfo.userId;
    saveValue.shareCategoryID = categoryID;
    saveValue.shareTitle = title;
    saveValue.shareContent = content;
    saveValue.shareLink = link;
    saveValue.sharePath = path;
    saveValue.type = type;
    saveValue.toTop = checked ? "1" : "0";
    try {
      const result: any = await addMyShare(saveValue);
      modalHandler(true);
      message.open({ type: "success", content: "新增成功!" });
    } catch (e) {
      message.open({ type: "success", content: "新增失败!" });
    }
  }

  async function onModifyBtnClickHander() {
    const modifyValue: any = {};
    modifyValue.shareCategoryID = categoryID;
    modifyValue.shareTitle = title;
    modifyValue.shareContent = content;
    modifyValue.shareLink = link;
    modifyValue.sharePath = path;
    modifyValue.nid = oneRow.nid;
    modifyValue.toTop = checked ? 1 : 0;
    try {
      const result: any = await modifyMyShare(modifyValue);
      const msg = JSON.parse(result as string);
      if (msg.error) {
        message.open({ type: "error", content: "修改失败!" });
        return;
      }
      message.open({ type: "success", content: "修改成功!" });
      modalHandler(true);
    } catch (e) {
      message.open({ type: "error", content: "修改失败!" });
    }
  }

  function onCloseBtnCallback() {
    modalHandler(false);
  }

  function Test(props: any) {
    return <div id="tttt">{props.title}</div>;
  }

  async function initPopCategoryList(category: any) {
    try {
      const result = await getCategoryList(category);
      const arr = JSON.parse(result as string);
      const categoryList = arr.data;
      const defaultValue = {
        categoryID: "000",
        categoryName: "--请选择--",
        type: "",
      };
      categoryList.unshift(defaultValue);
      setCategory(categoryList);
      setCategoryID(categoryList[0].categoryID);
    } catch (e) {
      setCategory([]);
      message.open({ type: "error", content: "获取分类列表失败!" });
    }
  }

  function onRadioChangeHandler(e: RadioChangeEvent) {
    setType(e.target.value);
    initPopCategoryList({ type: e.target.value });
  }

  function onCategoryChangeHandler(e: string, options: SelectValueType) {
    setType(options.type);
    setCategoryID(e);
  }

  function onToTopCheckboxChangeHandler() {
    setChecked(!checked);
  }

  function onTitleInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);
  }

  function onTextAreaChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
  }

  function onLinkInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setLink(value);
  }

  function onPathInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPath(value);
  }

  return (
    <>
      <Draggable handle="#tttt">
        <Modal
          title={<Test title={pTitle} />}
          onCancel={onCloseBtnCallback}
          visible
          maskClosable={false}
          footer={
            modify ? (
              <Button
                type="primary"
                className="operate-btn"
                icon={(<SaveOutlined />) as any}
                onClick={onModifyBtnClickHander}
              >
                修改
              </Button>
            ) : (
              <Button
                type="primary"
                className="operate-btn"
                icon={(<SaveOutlined />) as any}
                onClick={onSaveBtnClickHander}
              >
                保存
              </Button>
            )
          }
        >
          <Radio.Group
            size="small"
            value={type}
            buttonStyle="solid"
            onChange={onRadioChangeHandler}
          >
            <Radio.Button value={"A"}>技术分类</Radio.Button>
            <Radio.Button value={"B"}>Bug分类</Radio.Button>
          </Radio.Group>
          <div className="margin-t15">
            <Select
              fieldNames={{ label: "categoryName", value: "categoryID" }}
              className="fullWidth"
              options={category}
              value={categoryID}
              onChange={onCategoryChangeHandler}
            ></Select>
          </div>
          <div className="margin-t15">
            <label className="margin-r10 label-color">标题</label>
            <Checkbox checked={checked} onChange={onToTopCheckboxChangeHandler}>
              置顶
            </Checkbox>
            <Input value={title} onChange={onTitleInputChangeHandler}></Input>
          </div>

          <div className="margin-t10">
            <label className="label-color">分享内容</label>
            <TextArea
              value={content}
              onChange={onTextAreaChangeHandler}
              showCount
              allowClear
              rows={6}
            ></TextArea>
          </div>
          <div className="margin-t10">
            <label className="label-color">分享链接</label>
            <Input value={link} onChange={onLinkInputChangeHandler}></Input>
          </div>
          <div className="margin-t10">
            <label className="label-color">分享路径</label>
            <Input value={path} onChange={onPathInputChangeHandler}></Input>
          </div>
        </Modal>
      </Draggable>
    </>
  );
}
