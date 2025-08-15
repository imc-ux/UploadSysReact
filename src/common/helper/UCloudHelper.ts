import "@/style/cloud.css";

export default function UCloud(unmount: boolean = false) {
  if (unmount) {
    remove();
  } else {
    init();
  }
}

function remove() {
  document.querySelector(".site-bg").remove();
}

function init() {
  const parent = document.createElement("div");
  parent.className = "site-bg";
  parent.innerHTML = `
        <div class="site-bg-img"></div>
        <div class="site-bg-overlay"></div>
        <div class="site-bg-effect" style="opacity: 0.4;">
          <div class="cloud cloud-01 velocity-animating" ></div>
          <div class="cloud cloud-02 velocity-animating" ></div>
          <div class="cloud cloud-03 velocity-animating" ></div>
        </div>
    `;
  document.querySelector("body").appendChild(parent);

  Array.from(document.querySelectorAll(".cloud")).forEach(
    (cloud: HTMLDivElement, index) => {
      cloud.style.display = "block";
      if (index === 0) {
        start(cloud, 20, 10);
      } else if (index === 1) {
        start(cloud, 50, 20);
      } else if (index === 2) {
        start(cloud, 50, 20);
      }
    }
  );
}

function start(ele: HTMLDivElement, start: number, speed: number) {
  let x = start;
  ele.style.transform = translate({ x: `${x}%` });
  window.setInterval(() => {
    x = x - 1 / speed;
    if (x < -100) x = 100;
    ele.style.transform = translate({ x: `${x.toFixed(4)}%` });
  }, 10);
}

function translate(distance: any): string {
  const axes: any = {
    x: "0px",
    y: "0px",
    z: "0px",
  };
  Object.assign(axes, distance);
  return `translate3d(${axes.x}, ${axes.y}, ${axes.z} )`;
}
