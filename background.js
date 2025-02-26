/** @param {NS} ns */
export async function main(ns) {
  let doc = eval("document");
  let tails = doc.getElementsByClassName("react-draggable")

  doc.body.style.backgroundImage = "url('https://wallpaperaccess.com/full/8881475.gif')";

  doc.body.style.backgroundSize = "cover";
  doc.body.style.backgroundRepeat = "no-repeat";
  doc.body.style.backgroundBlendMode = "luminosity";

  for (let tail of tails) {
    tail.style.backgroundImage = "url('https://wallpaperaccess.com/full/8881475.gif')";
    tail.style.backgroundSize = "auto auto";
    tail.style.backgroundRepeat = "no-repeat";
    tail.style.backgroundColor = "rgba(0, 0, 0, 0.3)"
    tail.style.backgroundAttachment = "local"
  }
}