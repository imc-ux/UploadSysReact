const BIG_IMG_ID = "bigImg";
const IMG_MODAL_ID = "bigImgModal";

export function addImgEvent() {
  const topMenu = document.getElementById("topMenu");
  const imgInMenu = topMenu.querySelectorAll("img");

  imgInMenu.forEach((item) => {
    item.addEventListener("click", onMenuImgClickHandler);
  });
}

function onMenuImgClickHandler(e: any) {
  const imgHeight = e.target?.offsetHeight ?? 0;
  const imgWidth = e.target?.offsetWidth ?? 0;
  const imgLeft = e.target?.getBoundingClientRect()?.left ?? 0;
  const imgTop = e.target?.getBoundingClientRect()?.top ?? 0;
  const startX = imgLeft + imgWidth / 2;
  const startY = imgTop + imgHeight / 2;
  const endX = window.innerWidth / 2;
  const endY = window.innerHeight / 2;

  if (e.target) {
    const bigImgBackGround = document.createElement("div");
    bigImgBackGround.id = IMG_MODAL_ID;
    bigImgBackGround.style.position = "fixed";
    bigImgBackGround.style.top = "0px";
    bigImgBackGround.style.left = "0px";
    bigImgBackGround.style.zIndex = "2000";
    bigImgBackGround.style.width = "100vw";
    bigImgBackGround.style.height = "100vh";
    bigImgBackGround.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    bigImgBackGround.addEventListener("click", onBigImgClickHandler);
    const bigImg = document.createElement("img");
    bigImg.id = BIG_IMG_ID;
    bigImg.src = e.target.src;
    bigImg.style.position = "absolute";
    bigImg.style.zIndex = "3000";
    bigImg.style.left = `${imgLeft}px`;
    bigImg.style.top = `${imgTop}px`;
    bigImg.style.width = `${imgWidth}px`;
    bigImg.style.height = `${imgHeight}px`;
    bigImg.addEventListener("click", onBigImgClickHandler);
    document.body.appendChild(bigImg);
    document.body.appendChild(bigImgBackGround);
    setTimeout(() => {
      bigImg.style.transition = "all 0.5s";
      bigImg.style.transform = `translate(${endX - startX}px, ${
        endY - startY
      }px) scale(1.5)`;
    }, 0);
  }
}

function onBigImgClickHandler() {
  const bigImg = document.getElementById(BIG_IMG_ID);
  const bigImgModal = document.getElementById(IMG_MODAL_ID);
  bigImg.remove();
  bigImgModal.remove();
}
