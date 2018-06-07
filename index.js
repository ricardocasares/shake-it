import uniq from "uniqid";
import rand from "randomcolor";
import Shake from "@zouloux/shake";
import signalhub from "signalhub";

let peers = 0;
const id = uniq();
const color = rand({ seed: id });
const APP = "peer-party";
const JOINED = "peer-joined";
const SHAKED = "peer-shaked";

const hub = signalhub(APP, ["https://signals.analogic.al/"]);

window.onload = setup;

function setup() {
  if (admin()) {
    hub.subscribe(JOINED).on("data", joined);
    hub.subscribe(SHAKED).on("data", shaked);
  }

  if (!admin()) {
    listener(id);
    changeBackgroundColor(color);
    hub.broadcast(JOINED, { id, color });
  }
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
  const amount = rect.y - div.offsetTop - 40;
  div.style.transform = `translateY(${amount}px)`;
}

function listener(id) {
  const shaker = new Shake({
    timeout: 500,
    threshold: 10,
    handler: () => hub.broadcast(SHAKED, { id })
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
