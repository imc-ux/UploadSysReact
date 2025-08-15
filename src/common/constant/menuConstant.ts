import { MenuTemplateInfo } from "Common/vo";

export interface MenuItemType {
  nameCN: string;
  nameEN: string;
  selected: boolean;
  direction: number;
  type: MenuType;
}

export enum MenuType {
  BUSINESS = "business",
  INTERACTION = "interaction",
  MANAGE = "manage",
}

export const mainMenuList: MenuItemType[] = [
  {
    nameCN: "业务(上传信息)",
    nameEN: "Business(Upload)",
    type: MenuType.BUSINESS,
    selected: true,
    direction: 0,
  },
  {
    nameCN: "互动(Jtrac)",
    nameEN: "Interaction(Jtrac)",
    type: MenuType.INTERACTION,
    selected: false,
    direction: 0,
  },
  {
    nameCN: "管理(用户管理)",
    nameEN: "Manage(UserManage)",
    type: MenuType.MANAGE,
    selected: false,
    direction: 0,
  },
];

export const navOtherItemTranslation = {
  en: {
    version: "ver.",
  },
  cn: {
    version: "版",
  },
};

export const SUB_MENU_HEADER_IMG_FLAG = "HeaderImg";

export interface SubMenuDataType {
  type: MenuType;
  headImg: string;
  children: any[];
}

export const subMenuTemplateData: SubMenuDataType[] = [
  {
    type: MenuType.BUSINESS,
    headImg: "",
    children: [],
  },
  {
    type: MenuType.INTERACTION,
    headImg: "",
    children: [],
  },
  {
    type: MenuType.MANAGE,
    headImg: "",
    children: [],
  },
];

export const testTemplate: MenuTemplateInfo[] = [
  {
    nid: 0,
    type: MenuType.BUSINESS,
    template: `
    <html lang="en">
  <script>
  document.querySelector("#upload").removeEventListener("click", window.onUploadLinkClickHandler);
  document.querySelector("#manage").removeEventListener("click", window.onManageLinkClickHandler);
  window.onUploadLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/uploadSvelte.html"
  }
  window.onManageLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/mpPageManageMain.html"
  }

  
  document.querySelector("#upload").addEventListener("click", window.onUploadLinkClickHandler)
  document.querySelector("#manage").addEventListener("click", window.onManageLinkClickHandler)
  </script>
  <style>
  .flex-layout {
    display:flex
  }

  .min-width{
    width:100px
  }

  .ver-start{
    align-items:flex-start
  }

  .size-fixed{
    object-fit:contain
  }

  .flex-auto{
    flex: 1 1 auto;
  }

  .flex-col {
    flex-direction: column;
  }

  .padding-m{
    padding:10px;
  }

  .padding-lg{
    padding:15px;
  }

  .full-width {
    width:100%
  }

  .margin-m {
    margin:10px;
  }

  .text-box-height{
    height:30px;
  }

  .text-color{
    color:rgb(206, 145, 120);
  }

  .title-border{
        border-bottom:1px solid;
        border-image:linear-gradient(90deg,rgba(64, 132, 130, 0),rgba(64, 132, 130, 0.2) 6%,#408482 32%,#83c4c2 52%,#eca639 80%,rgba(236, 166, 57, 0.1) 95%,rgba(236, 166, 57, 0) 100%)2;
      }
  </style>
  <body >
    <div class="flex-layout">
                      <div class="flex-layout ver-start" style="width:400px">
                        <img
                          class="full-width size-fixed"
                          style="margin-top:30px"
                          src={{headImgSrc}}
                        ></img>
                      </div>
                      <div class="flex-layout flex-auto padding-lg">
                      {{#children}}
                        <div class="flex-layout flex-auto flex-col min-width padding-m" >
                          <div class="text-box-height title-border" ></div>
                          {{#content}}
                          {{#showList}}
                          <a id={{id}} class="margin-m">{{label}}</a>
                          {{/showList}}
                          {{#showHtml}}
                          {{{htmlString}}}
                          {{/showHtml}}
                          {{/content}}
                        </div>
                        {{/children}}
                      </div>
                    </div>
                    </body>
</html>
    `,
  },
  {
    nid: 1,
    type: MenuType.INTERACTION,
    template: `
    <html lang="en">
  <script>
  document.querySelector("#jtrac").removeEventListener("click", window.onJtracLinkClickHandler);
  document.querySelector("#git").removeEventListener("click", window.onGitLinkClickHandler);
  document.querySelector("#trans").removeEventListener("click", window.onTranslateLinkClickHandler);
  document.querySelector("#flatris").removeEventListener("click", window.onFlatrisLinkClickHandler);
  document.querySelector("#messageMain").removeEventListener("click", window.onMessageMainLinkClickHandler);
  document.querySelector("#gitLab").removeEventListener("click", window.onGitLabLinkClickHandler);
  document.querySelector("#task").removeEventListener("click", window.onTaskLinkClickHandler);
  document.querySelector("#statistic").removeEventListener("click", window.onStatisticLinkClickHandler);
  document.querySelector("#share").removeEventListener("click", window.onShareLinkClickHandler);
  document.querySelector("#message").removeEventListener("click", window.onMessageLinkClickHandler);
  document.querySelector("#template").removeEventListener("click", window.onTemplateLinkClickHandler);
  window.onJtracLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.6.42:70/jtrac/autologin.html"
  }
  window.onGitLinkClickHandler = function(){
    window.open("https://github.com/imc-ux");
  }
  window.onTranslateLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/react/index.html?#/main"
  }
  window.onFlatrisLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.6.42:3000/"
  }
  window.onMessageMainLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/reportsMS/messageMain"
  }
  window.onGitLabLinkClickHandler = function(){
    window.open("http://109.14.20.46:8099/");
  }
  window.onTaskLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/taskMgmtMain.html"
  }
  window.onStatisticLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/nuxt/analysis/"
  }
  window.onShareLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/react/index.html?#/share"
  }
  window.onMessageLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/messageBoard.html"
  }
  window.onTemplateLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/reportsMS/template"
  }
  
  document.querySelector("#jtrac").addEventListener("click", window.onJtracLinkClickHandler);
  document.querySelector("#git").addEventListener("click", window.onGitLinkClickHandler);
  document.querySelector("#trans").addEventListener("click", window.onTranslateLinkClickHandler);
  document.querySelector("#flatris").addEventListener("click", window.onFlatrisLinkClickHandler);
  document.querySelector("#messageMain").addEventListener("click", window.onMessageMainLinkClickHandler);
  document.querySelector("#gitLab").addEventListener("click", window.onGitLabLinkClickHandler);
  document.querySelector("#task").addEventListener("click", window.onTaskLinkClickHandler);
  document.querySelector("#statistic").addEventListener("click", window.onStatisticLinkClickHandler);
  document.querySelector("#share").addEventListener("click", window.onShareLinkClickHandler);
  document.querySelector("#message").addEventListener("click", window.onMessageLinkClickHandler);
  document.querySelector("#template").addEventListener("click", window.onTemplateLinkClickHandler);
  </script>
  <body >
    <div class="flex-layout">
                      <div class="flex-layout ver-start" style="width:400px">
                        <img
                          class="full-width size-fixed"
                          style="margin-top:30px"
                          src={{headImgSrc}}
                        ></img>
                      </div>
                      <div class="flex-layout flex-auto padding-lg">
                      {{#children}}
                        <div class="flex-layout min-width flex-auto flex-col padding-m" >
                          <div class="text-box-height title-border" ></div>
                          {{#content}}
                          {{#showList}}
                          <a id={{id}} class="margin-m">{{label}}</a>
                          {{/showList}}
                          {{#showHtml}}
                          {{{htmlString}}}
                          {{/showHtml}}
                          {{/content}}
                        </div>
                        {{/children}}
                      </div>
                    </div>
                    </body>
</html>
    `,
  },
  {
    nid: 2,
    type: MenuType.MANAGE,
    template: `
    <html lang="en">
  <script>
  document.querySelector("#userManage").removeEventListener("click", window.onUserManageLinkClickHandler);
  document.querySelector("#roleManage").removeEventListener("click", window.onRoleLinkClickHandler);
  document.querySelector("#permission").removeEventListener("click", window.onPermissionLinkClickHandler);
  document.querySelector("#setting").removeEventListener("click", window.onSettingLinkClickHandler);
  window.onUserManageLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/userMgmtMain.html#"
  }
  window.onRoleLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/react/index.html?#/role"
  }
  window.onPermissionLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/react/index.html?#/permission"
  }
  window.onSettingLinkClickHandler = function(){
    document.querySelector("#uploadSysMainContent").src="http://109.14.20.45:6636/cusys/nuxt/settings/"
  }

  
  document.querySelector("#userManage").addEventListener("click", window.onUserManageLinkClickHandler);
  document.querySelector("#roleManage").addEventListener("click", window.onRoleLinkClickHandler);
  document.querySelector("#permission").addEventListener("click", window.onPermissionLinkClickHandler);
  document.querySelector("#setting").addEventListener("click", window.onSettingLinkClickHandler);
  </script>
  <body >
    <div class="flex-layout">
                      <div class="flex-layout ver-start" style="width:400px">
                        <img
                          class="full-width size-fixed"
                          style="margin-top:30px"
                          src={{headImgSrc}}
                        ></img>
                      </div>
                      <div class="flex-layout flex-auto padding-lg">
                      {{#children}}
                        <div class="flex-layout flex-auto flex-col min-width padding-m" >
                          <div class="text-box-height title-border" ></div>
                          {{#content}}
                          {{#showList}}
                          <a id={{id}} class="margin-m">{{label}}</a>
                          {{/showList}}
                          {{#showHtml}}
                          {{{htmlString}}}
                          {{/showHtml}}
                          {{/content}}
                        </div>
                        {{/children}}
                      </div>
                    </div>
                    </body>
</html>
    `,
  },
];
