class SampleControl extends BaseControl {
    constructor({container}) {
        super(container);

        this.IDs = {
            headerElement: 'header-element',
        };

        this.events = {
            headerClicked: 'header-clicked',
        };
    }

    _initUI() {
        super._initUI();

        this.mainElement.append(`
            <h1 class="${this.absoluteID(this.IDs.headerElement)}"></h1>
        `);

        this.elementOfID(this.IDs.headerElement).on('click', () => {
            this.trigger(this.events.headerClicked, "data1", "data2");
        });
    }


}
