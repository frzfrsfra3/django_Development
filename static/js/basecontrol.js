class BaseControl {

    /**
     * creates a control inside a given container
     * @param container the container that this control is placed in
     *  can be an selector string or a jquery object
     */
    constructor(container) {
        this.container = $(container);
        this.mainElement = $();
        this.mainElementID = '--main-element';
        this.eventListener = new EventListener();
        console.log("calling "+ container);
        // console.log("mainelement  "+ mainElement);
        // set this attribute to true to disable the auto div element
        // added inside your container, makes the container itself
        // the main element, use with caution, if the element is removed
        // the container will be removed in this case
        //
        // if this option is used, it's better to set the main element
        // yourself if you prefer to not remove the container when the
        // control is removed.
        this.disableAutoWrapper = false;
    }

    /**
     * override change the main element HTML tag
     * @returns {jQuery} the main element jquery
     */
    getDefaultMainElement() {
        return $(`<div>`);
    }

    /**
     * override to prefix your component's IDs with more
     * specific value, appending your result to the superclass's.\n
     * doing this is only viable if you want different
     * instances of the same control to use different prefixes
     * otherwise this method uses the subclass's name
     * to avoid conflict between multiple controls
     * if different classes
     * @returns {string} the new ID prefix
     */
    getIDPrefix() {
        console.log(this.constructor.initialIDPrefix +" getting " +  this.constructor.name);
        return this.constructor.initialIDPrefix + this.constructor.name + "-";
    }

    /**
     * a shortcut `initUI` and `show`.\n
     * instead the consumer may also call the
     * `initUI` and `show` methods manually to achieve
     * a different behavior
     * don't override this method directly, instead
     * override `initUI` and `show` functions to insure
     * proper lifecycle of your controllers
     */
    launch() {
        this.initUI();
        this.show();
    }

    /**
     * A wrapper method to _initUI, which initialize the mainElement of this control
     * and wrap the actual initUI logic implemented in _initUI by two events namely
     * initUIStartedEvent and initUIFinishedEvent.
     * Please don't override this method.
     
    */
    initUI() {
        if (!this.disableAutoWrapper) {
            this.mainElement = this.getDefaultMainElement();
            this.container.append(this.mainElement);
        } else {
            this.mainElement = this.container;
        }
        this.mainElement.addClass(this.absoluteID(this.mainElementID));

        this.trigger(this.initUIStartedEvent);
        this._initUI();
        this.trigger(this.initUIFinishedEvent);
    }

    /**
     * override this method to add your UI
     * to the DOM, if it makes sense
     * you might want to add the UI of your
     * component as hidden and show it on
     * the `show` method to allow the controller's
     * consumer more control over the behavior
     */
    _initUI() {
    }

    /**
     * A wrapper method to _show which adds the events showStartedEvent and
     * showFinishedEvent to the show method.
     * Please don't override this method.
     */
    show() {
        this.trigger(this.showStartedEvent);
        this._show();
        this.trigger(this.showFinishedEvent);
    }

    /**
     * display your UI, optional method,
     * might just show the UI directly at initUI
     * if it makes more sense for this control
     */
    _show() {

    }

    /*** IDs ***/

    /**
     * returns the css class of the element identifier
     * @param id the id of the element
     * @returns {string} css class of the element identifier
     */
    absoluteID(id) {
        return this._absoluteID(id);
    }

    _absoluteID(id) {
        return this.getIDPrefix() + id;
    }

    /**
     * returns a string that can be used in a jquery selector to
     * find the object with a given ID, the ID should have been
     * used in the class attribute of the element
     * @param id the id of the element
     * @returns {String} jquery selector string
     */
    classSelectorOfID(id) {
        return '.' + this.absoluteID(id);
    }

    /**
     * returns a string that can be used in a jquery selector to
     * find the object with a given ID, the ID should have been
     * used in the `id` attribute of the element
     * @param id the id of the element
     * @returns {String} jquery selector string
     */
    htmlIDSelectorOfID(id) {
        console.log("id: " + id + " this.absoluteID(id) : " +this.absoluteID(id));
        return '#' + this.absoluteID(id);
    }

    /**
     * gets an element inside the current controls container
     * with the given ID, the ID should have been used in
     * the element's class property to be found correctly
     * if the ID attribute was used, use the elementOfHTMLID
     * method instead
     * @param id the id of the element
     * @returns {jQuery} the element as a jquery object
     */
    elementOfID(id) {
        return this.findByID(this.mainElement, id);
    }

    /**
     * returns an element where it's HTML ID attribute
     * is the classID of the given ID value
     * @param id the id of the element
     * @returns {*|jQuery} the element as a jquery object
     */
    elementOfHTMLID(id) {
        return $(this.htmlIDSelectorOfID(id));
    }

    /**
     * look for element with ID inside the given element
     * @param insideElement the element to look inside
     * @param id the ID of the element to find
     * @returns {jQuery} jquery selector of the search result
     */
    findByID(insideElement, id) {
        insideElement = $(insideElement);
        let me = this;
        // the filter check insures that we don't find elements of
        // inner controls if one of the inner controls is the same
        // class as ours, since IDs are unique for a class name
        return insideElement.find(this.classSelectorOfID(id)).filter(function () {
            // the cost of this call is small since the "closest" call is efficient
            return this.closest(me.classSelectorOfID(me.mainElementID)) === me.mainElement[0];
        });
    }

    /*** Events ***/

    /**
     * add event listener for the given event name, calling the callback function
     * when fired
     * @param {String} eventName the name of the event
     * @param {Function} callback the callback function to run when the event fires
     */
    on(eventName, callback) {
        this.eventListener.on(eventName, callback);
    }

    /**
     * add event listener for the given event name, calling the callback function
     * when fired only at the first time the event is fired
     * @param {String} eventName the name of the event
     * @param {Function} callback the callback function to run when the event fires
     */
    one(eventName, callback) {
        this.eventListener.one(eventName, callback);
    }

    /**
     * Removes event listeners for the given event name or one of them.
     * @param {String} eventName the name of the event to remove its listeners.
     * @param callback the handler to be removed (Optional)
     */
    off(eventName, callback) {
        this.eventListener.off(eventName, callback);
    }

    /**
     * fire up an event optionally having a set of arguments
     * @param {String} eventName the name of the event
     * @param {*} args Array of optional arguments
     */
    trigger(eventName, ...args) {
        this.eventListener.trigger(eventName, ...args);
    }

    // Events
    get removeEvent() {
        return BaseControl.events.remove;
    }

    get disabledEvent() {
        return BaseControl.events.disabled;
    }

    get enabledEvent() {
        return BaseControl.events.enabled;
    }

    get enabledChangedEvent() {
        return BaseControl.events.enabledChanged;
    }

    get initUIStartedEvent() {
        return BaseControl.events.initUIStarted;
    }

    get initUIFinishedEvent() {
        return BaseControl.events.initUIFinished;
    }

    get showStartedEvent() {
        return BaseControl.events.showStarted;
    }

    get showFinishedEvent() {
        return BaseControl.events.showFinished;
    }
}
// let x =new BaseControl("ab");

class subcontrol extends BaseControl{

}

BaseControl.initialIDPrefix = "id-";

BaseControl.events = {
    update: 'update',
    remove: 'remove',
    disabled: 'disabled',
    enabled: 'enabled',
    enabledChanged: 'enabled-changed',
    initUIStarted: 'init-ui-started',
    initUIFinished: 'init-ui-finished',
    showStarted: 'show-started',
    showFinished: 'show-finished',
};

function allExist(...args) {
    for (let i = 0; i < args.length; i++) {
        if (!value_exists(args[i])) {
            return false;
        }
    }
    console.log("all exists" + args);
    return true;
}

function value_exists(value) {
    console.log("value exists" + value);
    return value !== undefined && value !== null;
}
function property_value_exists(object, key) {
    if (!this.allExist(object, key)) {
        return false;
    }

    return value_exists(object[key]);
}

class EventListener {

    constructor() {
        this.events = {};
    }

    /**
     * raise an event by calling all handlers
     * of the event listeners synchronously
     * @param eventName {String} a string representing the name of the
     *  event that will be raised
     * @param eventArgs {Array} an array of arguments to send to the
     *  handlers of the event, must Always be an array even if 1 argument
     *  is sent, the handler will receive the elements of the array
     *  as separate arguments to his handler
     *
     * Example:
     * --------
     *
     *  const meEventName = 'big bang';
     *  let eventListener = new EventListener();
     *
     * Adding Handlers:
     * --------
     *  eventListener.on(meEventName, (foo, bar) => {
     *      console.log('This is big bang listener yo!');
     *   });
     *  eventListener.on(meEventName, (foo) => {
     *      console.log('This is another big bang listener yo!');
     *  });
     *
     * Triggering events:
     * --------
     *  eventListener.trigger(meEventName, foo, bar);
     *
     */
    trigger(eventName, ...eventArgs) {
        if (property_value_exists(this.events, eventName)) {
            this.events[eventName].forEach(function (callback) {
                callback.apply(this, eventArgs);
            });
        }
    }

    /**
     * set a callback function to be called when the eventListener's
     * event is fired
     * @param eventName {String} a string representing the name of the
     *  event to listen to.
     * @param callback a handler function to call when the event is raised
     *  on this eventListener
     */
    on(eventName, callback) {
        if (!property_value_exists(this.events, eventName)) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * set a callback function to be called when the eventListener's
     * event is fired only at the first time
     * @param eventName {String} a string representing the name of the
     *  event to listen to.
     * @param callback a handler function to call when the event is raised
     *  on this eventListener
     */
    one(eventName, callback) {
        const me = this;
        function innerCallback(args) {
            callback(args);
            me.off(eventName, innerCallback);
        }
        this.on(eventName, innerCallback);
    }

    /**
     * removes all event listeners on an event or one of them
     * @param eventName {String} a string representing the name of the
     * event to remove its listeners.
     * @param callback the handler to be removed (Optional)
     */
    off(eventName, callback) {
        if (!property_value_exists(this.events, eventName)) {
            return;
        }
        if (value_exists(callback)) {
            const index = this.events[eventName].indexOf(callback);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
                return;
            }
        }
        this.events[eventName] = [];
    }
}
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

// var xx=new BaseControl("ab");

class Sub extends BaseControl {
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
    createBy(koko)
    {
        $("'#"+koko+`'` ).html("<h1>" + koko +"</h1>");

    }
    push(text)
    {
        this.container.push(text);
    }
    createInput(type,value)
    {
        this.mainElement.append(`
        <input class="${this.absoluteID(this.IDs.headerElement)}" type='${type}' value="${value}" /> <br>
    `);

    }
    fullelement ()
    {
      return  this.absoluteID(this.IDs.headerElement);
    }

    createDropdown()
    {
        this.mainElement.append(`
        <select class="${this.absoluteID(this.IDs.headerElement)}" type='' >
        <option > choose an item </option>
        </select>
    <br/>`);

    }
    createButton(value)
    {
        this.mainElement.append(`
        <Button class=" ${this.absoluteID(this.IDs.headerElement)} " type='' >
        ${value}
        </button>
   <br/> `);

    }
    createLabel(value)
    {
        this.mainElement.append(`
        <label id="${this.absoluteID(this.IDs.headerElement)}" >
        ${value}
        </label>
    <br/>`);

    }

    linker(event,array,value)
    {
        event.preventDefault();
       var status=array.indexOf(value)!==-1 ?  'this value already exists' : 'this value was added' ;
  var labelling=document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +"" );
  var listing=document.querySelector("select." +this.absoluteID(this.IDs.headerElement) +"" );
  if(!listing)
  this.createDropdown();
       if(!labelling )
       this.createLabel();
       document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
       if(status=="this value was added")
       {
        var el = document.createElement("option");
        el.value=value;
      listing.appendChild(el);
      el.textContent=value;

           array.push(value);
        //    document.querySelector("label." +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
        //    document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
           return true;
       }
    
       console.log(array);
       return false;
    }

  submitlinker(event,array,dora)
    {
        event.preventDefault();
    var boxvalue=document.querySelector(dora);
    if(boxvalue)
    {
    boxvalue = document.querySelector(dora).value;
    }
    else {
    boxvalue = document.getElementById('box').value;
    }

       var status=array.indexOf(boxvalue)!==-1 ?  'this value already exists' : 'this value was added' ;
  var labelling=document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +"" );
  var listing=document.querySelector("select." +this.absoluteID(this.IDs.headerElement) +"" );
  if(!listing)
  this.createDropdown();
       if(!labelling )
       this.createLabel();
       document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
    //   window.addEventListener("load",this.changeDropdown(),false);
  //  listing.on("load",this.changeDropdown);
 
       if(status=="this value was added")
       {
        var el = document.createElement("option");
        el.value=boxvalue;
      listing.appendChild(el);
      el.textContent=boxvalue;

           array.push(boxvalue);
        //    document.querySelector("label." +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
        //    document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +" " ).innerHTML=status;
           return true;
       }
    //    else if(status=="this value was added") {

    // }
    //    else
    //   {
    //    this.on("change",    this.changeDropdown  );
    //    }
   // this.on("change",    this.changeDropdown()  );
       console.log(array);
     //  window.addEventListener("load",this.changeDropdown(),false);
       return false;
    }
     changeDropdown()
     {
        var e = document.querySelector("select." +this.absoluteID(this.IDs.headerElement) +"" );
  //      e.addEventListener("change",this.dropdowntrigger(),false);
 //  e.addEventListener("change",this.dropdowntrigger(),false);
       //  e.trigger("change",this.dropdowntrigger());
     //  e.trigger("change",this.dropdowntrigger());
     var url = e.options[e.selectedIndex].value;

  var b=  document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +"" ).innerHTML="Dropdown changed to "+ url;   

  e.addEventListener("change",this.dropdowntrigger2(this.absoluteID(v_4.IDs.headerElement)),false)
     //    this.trigger("change",this.dropdowntrigger());
}
 
     dropdowntrigger()
     {
    ///   this.trigger("load",this.changeDropdown());
        var e = document.querySelector("select." +this.absoluteID(this.IDs.headerElement) +"" );
        var url = e.options[e.selectedIndex].value;
        document.querySelector("#" +this.absoluteID(this.IDs.headerElement) +"" ).innerHTML="Dropdown changed to "+ url;
     }
   

}