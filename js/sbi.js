export class SetBGImage {
    constructor({ elements }) {
        this.elements = elements;

        this.imageBackgroundSetter();
    }

    imageBackgroundSetter() {
        Array.from(this.elements).forEach((elem) => {
            let src = "." + elem.children[0].src.match(/\/src.+/i);
            let fullBG = `url('${src}') ${elem.dataset.sbi}`;
            let currentBG = window.getComputedStyle(elem).background;
            currentBG = currentBG.replace("rgba(0, 0, 0, 0)", "");

            if (elem.dataset.sbiPosition && currentBG) {
                if (elem.dataset.sbiPosition == "top") elem.style.background = fullBG + ", " + currentBG;
                if (elem.dataset.sbiPosition == "bottom") {
                    elem.style.background = currentBG + ", " + fullBG;
                }
            } else {
                elem.style.background = fullBG;
            }

            elem.children[0].remove();
        });
    }
}
