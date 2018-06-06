import uniq from "uniqid";
import rand from "randomcolor";
import Shake from "@zouloux/shake";
import signalhub from "signalhub";

let peers = 0;
const id = uniq();
const color = rand();
const APP = "peer-party";
const JOINED = "peer-joined";
const SHAKED = "peer-shaked";

const hub = signalhub(APP, ["https://signals.analogic.al/"]);

if (admin()) {
  hub.subscribe(JOINED).on("data", data => joined(data));
  hub.subscribe(SHAKED).on("data", data => shaked(data));
}

if (!admin()) {
  listener(id);
  changeBackgroundColor(color);
  setTimeout(() => {
    hub.broadcast(JOINED, { id, color });
  }, 1000);
}

function joined({ id, color }) {
  const div = document.createElement("div");
  div.setAttribute("id", id);
  div.classList.add("peer");
  div.style.left = `${peers * 110}px`;
  div.style.backgroundColor = color;
  document.body.appendChild(div);
  peers++;
}

function shaked({ id }) {
  const div = document.getElementById(id);
  const rect = div.getBoundingClientRect();
  const amount = rect.y - div.offsetTop - 25;
  div.style.transform = `translateY(${amount}px)`;
}

function listener(id) {
  const shaker = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000, // optional, determines the frequency of event generation
    handler: () => {
      hub.broadcast(SHAKED, { id });
    }
  });
  shaker.start();
}

function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
}

function admin() {
  const url = new URL(document.location);
  return url.searchParams.has("admin");
}
