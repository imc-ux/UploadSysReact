import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  message,
  Select,
  Input,
  Pagination,
  Spin,
  Popconfirm,
} from "antd";
import { columns } from "@/component/common/ShareColumn";
import {
  getUserList,
  getCategoryList,
  getTitleList,
  clickShareTimes,
  deleteMyShare,
  toTopShare,
  getUserActivePermission,
} from "@/remote/shareAction";
import { GridDataType } from "@/vo/Share";
import { UserInfo } from "@/util/Setting";
import AddShareInfo from "@/component/common/AddShareInfoPop";
import {
  DownloadOutlined,
  ToTopOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { changeTheme, changeThemeMode } from "@/util/themeHelper";
import { ThemeMode } from "@/util/constants";

const pageItem = [
  { name: "10 Item", id: 10 },
  { name: "20 Item", id: 20 },
  { name: "50 Item", id: 50 },
];

const leftSortDataProvider = [
  { value: "01", label: "全部", type: "" },
  { value: "02", label: "技术分类", type: "A" },
  { value: "03", label: "BUG分类", type: "B" },
];

const xlsxDocHeaderName = [
  "题目",
  "分类",
  "分享链接",
  "作者",
  "修改时间",
  "热度",
];

export interface SelectValueType {
  value?: string;
  label?: string;
  type?: string;
  name?: string;
  id?: number;
}

interface ValueType {
  titleId?: number;
  userId?: string;
  type?: string;
}

export default function Share() {
  const [anthor, setAuthor] = useState(null);
  const [anthorID, setAuthorID] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [sort, setSort] = useState<string>("01");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [articleData, setArticleData] = useState<GridDataType[]>(null);
  const [pageCount, setpageCount] = useState<number>(20);
  const [pageSize, setpageSize] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rotate, setRotate] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [oneRow, setOneRow] = useState<GridDataType[]>(null);
  const [isButton, setIsButton] = useState<boolean>(true);
  const [showAddBtn, setShowAddBtn] = useState<boolean>(false);
  const [showDelBtn, setShowDelBtn] = useState<boolean>(false);
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    initUserList();
    initCategoryList({ type: "" });
    setUserPermission(UserInfo.userId);
  }, []);

  useEffect(() => {
    window?.addEventListener("open", onOpenLinkHandler);
    window?.addEventListener("clickPop", onOpeModalEventHandler);
    return () => {
      window?.removeEventListener("open", onOpenLinkHandler);
      window?.removeEventListener("clickPop", onOpeModalEventHandler);
    };
  }, []);

  const searchInfoRef = useRef(null);

  async function setUserPermission(userID: string) {
    try {
      const result = await getUserActivePermission(userID);
      const PermissionData = JSON.parse(result as string);
      if (PermissionData?.data?.includes("F_A")) {
        setShowAddBtn(true);
      }
      if (PermissionData?.data?.includes("F_B")) {
        setShowDelBtn(true);
      }
      if (PermissionData?.data?.includes("F_C")) {
        setShowTopBtn(true);
      }
    } catch (e) {
      alert(e);
    }
  }

  function onOpenLinkHandler(openValue: CustomEvent) {
    let clickValue: ValueType = {};
    clickValue.titleId = openValue.detail.id;
    clickValue.userId = UserInfo.userId;
    clickValue.type = "B";

    window.open(openValue.detail.link);
    initAticlesClickTimeHandler(clickValue);
  }

  function onOpeModalEventHandler(openEvent: CustomEvent) {
    setModal(true);
    setIsButton(false);
    if (openEvent) {
      setOneRow(openEvent.detail.record);
    }
  }

  async function initAticlesClickTimeHandler(value: ValueType) {
    try {
      const result = await clickShareTimes(value);
      const arr = JSON.parse(result as string);
      onSearchBtnClickHandler();
    } catch (e) {
      alert("热度更新失败！");
    }
  }

  async function initUserList() {
    const anthorValue: any = {
      blockflag: "N",
      usertype: "U",
      iStart: 0,
      iPageCount: 20,
    };
    try {
      const result = await getUserList(anthorValue);
      const arr = JSON.parse(result as string);
      const userlist = arr.data;
      const defaultValue = {
        id: "",
        name: "--请选择--",
      };
      userlist.unshift(defaultValue);
      setAuthorID(userlist[0].id);
      setAuthor(arr.data);
    } catch (e) {
      setAuthor([]);
      alert(e);
    }
  }

  async function initCategoryList(category: ValueType) {
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
      setCategoryID(categoryList[0].categoryID);
      setCategory(categoryList);
    } catch (e) {
      setCategory([]);
      alert(e);
    }
  }

  async function initGetArticleList(search: GridDataType) {
    try {
      const result = await getTitleList(search);
      const arr = JSON.parse(result as string);
      setSelectedRowKeys([]);
      setRotate(false);
      arr.data?.forEach((ele: GridDataType) => {
        if (!ele.shareLink || ele.shareLink === "null") {
          ele.shareLinkShow = "";
          ele.shareLink = "";
        } else if (
          ele.shareLink.indexOf(".xls") > -1 ||
          ele.shareLink.indexOf(".xlsx") > -1 ||
          ele.shareLink.indexOf(".doc") > -1 ||
          ele.shareLink.indexOf(".docx") > -1 ||
          ele.shareLink.indexOf(".ppt") > -1 ||
          ele.shareLink.indexOf(".pptx") > -1 ||
          ele.shareLink.indexOf(".txt") > -1 ||
          ele.shareLink.indexOf(".pdf") > -1 ||
          ele.shareLink.indexOf(".rar") > -1
        ) {
          ele.shareLinkShow = ele.shareLink.substring(
            ele.shareLink.lastIndexOf("/") + 1
          );
        } else if (ele.shareLink.indexOf("?") > -1) {
          ele.shareLinkShow = ele.shareLink.substring(
            0,
            ele.shareLink.lastIndexOf("?")
          );
        } else {
          ele.shareLinkShow = ele.shareLink;
        }
        ele.createDateShow = ele.createDate.slice(0, 10);
      });
      setArticleData(arr.data);
      if (arr.data?.[0]) {
        setTotal(Number(arr.data[0].totalCount));
        setpageSize(pageCount);
      }
    } catch (e) {
      setArticleData([]);
      alert(e);
    }
  }

  function onSearchBtnClickHandler() {
    const searchInfo: any = {};
    if (anthorID) {
      searchInfo.shareUserId = anthorID;
    }
    if (categoryID && categoryID !== "000") {
      searchInfo.shareCategoryID = categoryID;
    }

    searchInfo.type =
      leftSortDataProvider[
        leftSortDataProvider.findIndex((ele) => ele.value === sort)
      ].type;

    if (title?.trim()) {
      searchInfo.shareTitle = title.trim();
    }
    if (content) {
      searchInfo.shareContent = content;
    }
    searchInfo.iStart = 0;
    searchInfo.iPageCount = pageCount;
    searchInfoRef.current = searchInfo;
    setRotate(true);
    setCurrentPage(1);
    initGetArticleList(searchInfo);
  }

  async function onDownloadClickHandler() {
    if (!searchInfoRef.current) {
      alert("请先检索数据");
      return;
    }
    const req = JSON.parse(JSON.stringify(searchInfoRef.current));
    req.iStart = 0;
    req.iPageCount = 10000;
    try {
      const result = await getTitleList(req);
      const arr = JSON.parse(result as string);
      arr.data?.forEach((ele: GridDataType) => {
        if (!ele.shareLink || ele.shareLink === "null") {
          ele.shareLinkShow = "";
          ele.shareLink = "";
        } else if (
          ele.shareLink.indexOf(".xls") > -1 ||
          ele.shareLink.indexOf(".xlsx") > -1 ||
          ele.shareLink.indexOf(".doc") > -1 ||
          ele.shareLink.indexOf(".docx") > -1 ||
          ele.shareLink.indexOf(".ppt") > -1 ||
          ele.shareLink.indexOf(".pptx") > -1 ||
          ele.shareLink.indexOf(".txt") > -1 ||
          ele.shareLink.indexOf(".pdf") > -1 ||
          ele.shareLink.indexOf(".rar") > -1
        ) {
          ele.shareLinkShow = ele.shareLink.substring(
            ele.shareLink.lastIndexOf("/") + 1
          );
        } else if (ele.shareLink.indexOf("?") > -1) {
          ele.shareLinkShow = ele.shareLink.substring(
            0,
            ele.shareLink.lastIndexOf("?")
          );
        } else {
          ele.shareLinkShow = ele.shareLink;
        }
      });
      DownloadDataHandler(arr.data);
    } catch (e) {
      message.open({ type: "error", content: e });
    }
  }

  function DownloadDataHandler(allValue: any) {
    const filename = "技术分享.xlsx";

    if (allValue.length === 0) {
      message.open({ type: "warning", content: "请先检索数据！" });
    } else {
      for (let i = 0; i < allValue.length; i++) {
        for (let key in allValue[i]) {
          if (key === "shareTitle") {
            allValue[i]["题目"] = allValue[i][key];
            delete allValue[i][key];
          } else if (key === "shareCategoryName") {
            allValue[i]["分类"] = allValue[i][key];
            delete allValue[i][key];
          } else if (key === "shareLink") {
            allValue[i]["分享链接"] = allValue[i][key];
            delete allValue[i][key];
          } else if (key === "shareUserName") {
            allValue[i]["作者"] = allValue[i][key];
            delete allValue[i][key];
          } else if (key === "createDate") {
            allValue[i]["修改时间"] = allValue[i][key];
            delete allValue[i][key];
          } else if (key === "clickTimes") {
            allValue[i]["热度"] = allValue[i][key];
            delete allValue[i][key];
          } else {
            delete allValue[i][key];
          }
        }
      }
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(allValue, {
      header: xlsxDocHeaderName,
    });
    const tableWidth: any[] = [];
    columns.forEach((item) => {
      tableWidth.push({ wpx: item.width });
    });
    worksheet["!cols"] = tableWidth;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  }

  function onAddBtnClickHandler() {
    setModal(true);
    setIsButton(true);
  }

  function onModalCloseBtnHandler(value: boolean) {
    setModal(false);
    if (value) {
      onSearchBtnClickHandler();
    }
  }

  function onResetBtnClickHander() {
    setAuthorID("");
    setTitle("");
    setContent("");
    setCategoryID("000");
    setSort("01");
  }

  function onChangePageHandler(page: number) {
    setCurrentPage(page);
    searchInfoRef.current.iStart = (page - 1) * pageCount;
    searchInfoRef.current.iPageCount = pageCount;
    initGetArticleList(searchInfoRef.current);
  }

  function onSelectChange(newSelectedRowKeys: React.Key[]) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  function onLeftCategoryChangeHandler(
    _: string,
    optionValue: SelectValueType
  ) {
    setSort(optionValue.value);
    initCategoryList({ type: optionValue.type });
  }

  function onRightCategoryChangeHandler(category: SelectValueType) {
    setCategoryID(category);
  }

  function onChangePageItemHandler(pageCount: number) {
    setpageCount(pageCount);
  }

  function onSelectUserChangeHandler(userValue: SelectValueType) {
    setAuthorID(userValue);
  }

  function onTitleChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const titleValue = e.target.value;
    setTitle(titleValue);
  }

  function onContentChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const contentValue = e.target.value;
    setContent(contentValue);
  }

  async function onDelBtnConfirmEventHandler() {
    setVisible(false);
    if (selectedRowKeys.length > 0) {
      const delValue: any = {};
      delValue.nids = selectedRowKeys.join(",");

      try {
        const result = await deleteMyShare(delValue);
        const msg = JSON.parse(result as string);
        if (msg.error) {
          message.open({ type: "error", content: "删除失败!" });
          return;
        }
        message.open({ type: "success", content: "删除成功" });
        if (delValue) {
          onSearchBtnClickHandler();
        }
      } catch (e) {
        message.open({ type: "error", content: e });
      }
    }
  }

  function onDelBtnCancelEventHandler() {
    setVisible(false);
    message.success("取消删除");
  }

  function onDelBtnClickHandler() {
    if (!articleData || articleData.length === 0) {
      setVisible(false);
      message.open({ type: "warning", content: "请先检索数据！" });
      return;
    } else if (articleData) {
      setVisible(true);
      if (!selectedRowKeys || selectedRowKeys.length === 0) {
        setVisible(false);
      }
    }
  }

  async function onTotopClickHandler() {
    if (selectedRowKeys.length > 0) {
      const selectedData = articleData.filter((ele) => {
        return selectedRowKeys.includes(ele.nid);
      });

      const notTopData = selectedData.filter((ele) => {
        return ele.toTop !== 1;
      });

      if (notTopData.length === 0) {
        message.open({ type: "warning", content: "所选数据都已置顶" });
        return;
      }

      const tempArray: any[] = [];
      notTopData.forEach((ele) => {
        tempArray.push(ele.nid);
      });

      const value: any = {};
      value.nids = tempArray.join();

      const result = await toTopShare(value);
      const arr = JSON.parse(result as string);

      message.open({ type: "success", content: "所选数据已置顶" });

      onSearchBtnClickHandler();
    } else if (selectedRowKeys.length === 0) alert("请先选择要置顶的数据！");
  }
  // ===================测试主题===================================
  function onThemeSwitchChangeHandler(e: any) {
    if (e.target.checked) {
      changeTheme("ux-green-light");
    } else {
      changeTheme("ux-dark");
    }
  }

  function onThemeModeSwitchChangeHandler(e: any) {
    if (e.target.checked) {
      changeThemeMode(ThemeMode.Dark);
    } else {
      changeThemeMode(ThemeMode.Light);
    }
  }
  // =======================================================
  return (
    <div className="fullWidth page-wrap h-screen">
      <div className="pt-10px">
        <div className="div-flex search-wrap">
          <div className="div-flex flex-1 v-middle">
            <label className="search-title2">作者</label>
            <div className="flex-3">
              <Select
                className="fullWidth"
                fieldNames={{ label: "name", value: "id" }}
                options={anthor}
                value={anthorID}
                onChange={onSelectUserChangeHandler}
              ></Select>
            </div>
          </div>
          <div className="col-gap"></div>
          <div className="div-flex flex-1">
            <div className="flex-1">
              <Select
                fieldNames={{ label: "label", value: "value" }}
                options={leftSortDataProvider}
                onChange={onLeftCategoryChangeHandler}
                style={{ width: 120 }}
                value={sort}
                className="margin-r5"
              ></Select>
            </div>
            <div className="flex-3">
              <Select
                fieldNames={{ label: "categoryName", value: "categoryID" }}
                options={category}
                value={categoryID}
                onChange={onRightCategoryChangeHandler}
                className="fullWidth"
              ></Select>
            </div>
          </div>
          <div className="col-gap"></div>
          <div className="div-flex flex-1 v-middle">
            <label className="search-title2">标题</label>
            <Input
              allowClear
              className="flex-3"
              value={title}
              onChange={onTitleChangeHandler}
            ></Input>
          </div>
          <div className="col-gap"></div>
          <div className="div-flex flex-1 v-middle">
            <label className="search-title2">内容</label>
            <Input
              allowClear
              className="flex-3"
              value={content}
              onChange={onContentChangeHandler}
            ></Input>
          </div>
        </div>
      </div>
      <div className="div-flex" style={{ height: "60px" }}>
        <div className="div-flex v-middle h-left flex-2">
          {showAddBtn && (
            <Button
              className="margin-r5 operate-btn"
              icon={(<PlusOutlined className="btn-icon-color" />) as any}
              onClick={onAddBtnClickHandler}
            >
              新增
            </Button>
          )}
          {showDelBtn && (
            <Popconfirm
              title="确定删除吗？"
              visible={visible}
              onConfirm={onDelBtnConfirmEventHandler}
              onCancel={onDelBtnCancelEventHandler}
              okText="确定"
              cancelText="取消"
            >
              <Button
                className="margin-r5"
                icon={(<DeleteOutlined className="btn-icon-color" />) as any}
                onClick={onDelBtnClickHandler}
              >
                删除
              </Button>
            </Popconfirm>
          )}
          <Button
            className="margin-r5 operate-btn"
            icon={(<DownloadOutlined className="btn-icon-color" />) as any}
            onClick={onDownloadClickHandler}
          >
            下载
          </Button>
          {showTopBtn && (
            <Button
              className="margin-r5"
              icon={(<ToTopOutlined className="btn-icon-color" />) as any}
              onClick={onTotopClickHandler}
            >
              置顶
            </Button>
          )}
          <Select
            fieldNames={{ label: "name", value: "id" }}
            options={pageItem}
            style={{ width: 150, height: 30 }}
            value={pageCount}
            onChange={onChangePageItemHandler}
          ></Select>
        </div>
        <div className="div-flex v-middle h-right flex-2">
          <Button
            className="margin-r5 operate-btn"
            onClick={onSearchBtnClickHandler}
          >
            检索
          </Button>
          <Button className="operate-btn" onClick={onResetBtnClickHander}>
            重置
          </Button>
        </div>
      </div>
      <div>
        <div>
          {/* <Spin className="margin-t20 position-r" spinning={rotate} /> */}
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={articleData}
            rowKey={(item) => item.nid}
            bordered
            pagination={false}
            scroll={{ y: 450 }}
          ></Table>
          {modal && (
            <AddShareInfo
              modalHandler={onModalCloseBtnHandler}
              oneRow={oneRow}
              isButton={isButton}
            />
          )}
        </div>
        <div>
          {total > 0 && (
            <Pagination
              className="h-center div-flex margin-t10"
              pageSize={pageSize}
              total={total}
              current={currentPage}
              onChange={onChangePageHandler}
            ></Pagination>
          )}
        </div>
        {/* 测试用=================================== */}
        {/* <div className="form-check form-switch flex-column">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            onChange={onThemeSwitchChangeHandler}
          />
          主题
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            onChange={onThemeModeSwitchChangeHandler}
          />
          亮暗
        </div> */}
        {/* 测试用=================================== */}
      </div>
    </div>
  );
}
