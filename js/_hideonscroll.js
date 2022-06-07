export class HideOnScroll {

    constructor({
        element,
        menu,
        menuActiveClass = 'active',
    }) {
        this.element = element;
        this.menu = menu;
        this.menuActiveClass = menuActiveClass;
        this.currentOffset = window.pageYOffset;

        this.onScroll = this.onScroll.bind(this);

        window.addEventListener('scroll', this.onScroll);
    }

    onScroll() {
        let deltaScroll = window.pageYOffset - this.currentOffset;
        this.currentOffset = window.pageYOffset;

        if (this.menu.classList.contains(this.menuActiveClass)) return;

        this.hideAndShow(deltaScroll);
    }

    hideAndShow(delta) {
        if (!this.element.style.top) this.element.style.top = 0 + 'px';
    
        this.element.style.top = parseInt(this.element.style.top) - delta + 'px';
    
        if (parseInt(this.element.style.top) > 0) {
            this.element.style.top = 0 + 'px';
        }
    
        if (parseInt(this.element.style.top) < -this.element.offsetHeight) {
            this.element.style.top = -this.element.offsetHeight + 'px';
        }
    }

}