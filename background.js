/** @param {NS} ns */
export async function main(ns) {
  let doc = eval("document");

  const imageUrl = 'https://wallpaperaccess.com/full/5248853.gif'

  doc.body.style.width = "100%";
  doc.body.style.height = "100vh";

  doc.body.style.backgroundImage = `url(${imageUrl})`;
  doc.body.style.backgroundSize = "cover";
  doc.body.style.backgroundRepeat = "no-repeat";
  doc.body.style.backgroundPosition = "center";
  doc.body.style.backgroundAttachment = "fixed";


  const uiElements = doc.querySelectorAll('.MuiBox-root');

  for (let element of uiElements) {
    element.style.background = 'rgba(0, 0, 0, 0.3)';

    element.style.backdropFilter = 'blur(5px)';
    element.style.borderRadius = '10px';
    element.style.padding = "5px";
  }


  /**
   * THIS IS THE WINDOW POSITION TRACKER TO MOVE BACKGROUND IMAGE
   */
  // let isDragging;
  // let startX;
  // let startY;

  // console.log(tailWindow);

  // tailWindow.addEventListener('mousedown', (event) => {
  //   isDragging = true;
  //   startX = event.clientX;
  //   startY = event.clientY;
  // })

  // tailWindow.addEventListener('mousemove', (e) => {
  //   if (isDragging) {
  //     tailWindow.style.backgroundPosition = `${e.clientX - startX}px ${ e.clientY - startY }px`
  //   }
  // })

  // tailWindow.addEventListener('mouseup', () => {
  //   isDragging = false;
  // })

}