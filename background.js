/** @param {NS} ns */
export async function main(ns) {

  while (true) {

    let doc = eval("document");

    const imageUrl = 'https://wallpaperaccess.com/full/5248853.gif'

    doc.body.style.width = "100%";
    doc.body.style.height = "100vh";

    doc.body.style.backgroundImage = `url(${imageUrl})`;
    doc.body.style.backgroundSize = "cover";
    doc.body.style.backgroundRepeat = "no-repeat";
    doc.body.style.backgroundPosition = "center";
    doc.body.style.backgroundAttachment = "fixed";


    const uiElements = doc.querySelectorAll('.react-draggable');
    const monacoStyles = doc.querySelectorAll('.monaco-editor-background')
    const focusContainers = doc.querySelectorAll('.MuiPaper-elevation')
    const stickWidgets = doc.querySelectorAll('.sticky-widget');


    for (let element of uiElements) {
      element.style.backdropFilter = 'blur(5px)';
      element.style.borderRadius = '10px';
      element.style.padding = "10px"
      element.style.paddingBottom = "30px";
    }

    for (let widget of stickWidgets) {
      widget.style.background = 'rgba(0, 0, 0, 0.5)';
      widget.style.backdropFilter = 'blur(5px)';
    }


    for (let container of focusContainers) {
      container.style.backdropFilter = 'blur(5px)';
      container.style.borderRadius = '10px';
      container.style.padding = "5px";
    }

    if (monacoStyles && monacoStyles.length >= 1) {
      for (let editor of monacoStyles) {
        editor.style.backdropFilter = 'blur(5px)';
        editor.style.borderRadius = '10px';
        editor.style.background = 'rgba(0, 0, 0, 0.5)';
      }
    }




    await ns.share();
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