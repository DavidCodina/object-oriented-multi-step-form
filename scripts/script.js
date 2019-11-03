class MultiForm {
  constructor(formId, options = {}) {
    this.form               = document.getElementById(formId);
    this.currentTabIndex    = 0;
    this.init();
  }


  /* ===========================================================================
                                    init
  =========================================================================== */


  init(){
    const self           = this;
    const previousButton = self.form.getElementsByClassName('previous-button')[0];
    const nextButton     = self.form.getElementsByClassName('next-button')[0];
    const inputs         = self.form.getElementsByTagName("INPUT");


    self.showTab(self.currentTabIndex);


    /* =========================================================================
                                Event Listeners
    ========================================================================= */


    previousButton.addEventListener('click', () => self.nextPrev(-1));
    nextButton.addEventListener('click',     () => self.nextPrev(1));



    self.form.addEventListener('submit', function(e){
      e.preventDefault();

      //Do somthing with data...
      //const firstName = e.target.elements.firstName.value;
      //const lastName  = e.target.elements.lastName.value;
      //etc.


      //Reset the form. The data will still be in the form unless we erase it.
      //This fact is somewhat obscured because once we get to the final tab there is
      //no previous button. However, the data is still in those fields.
      e.target.reset();


      //Optionally redirect
      //window.location.href = "http://www.gi-gen.com/wp-content/uploads/2015/10/Hands-Arrange-A-Success-Text.jpg";
    });


    for (let i = 0; i < inputs.length; i++){
      const input = inputs[i];
      input.addEventListener('blur', function(){
        self.validateField(this);
      });
    }
  }


  /* ===========================================================================
                                updateIndicator
  =========================================================================== */


  updateIndicator(tabIndex){
    const self               = this;
    const indicatorContainer = self.form.getElementsByClassName('indicator-container')[0];
    const successCheck       = self.form.getElementsByClassName('form-submit-success-check')[0];
    const indicators         = self.form.getElementsByClassName("indicator");
    const tabs               = self.form.getElementsByClassName("tab");


    for (let i = 0; i < indicators.length; i++) {
      const indicator = indicators[i];
      indicator.classList.remove("active");
    }

    if (tabIndex !== tabs.length - 1) {
      indicators[tabIndex].classList.add("active");
    } else {
      indicatorContainer.style.display = "none";
      successCheck .style.display      = "block";
    }
  }


  /* ===========================================================================
                                validateField
  =========================================================================== */
  //Note: validateField and validateTab have limited validation in this example.
  //In a real-world example we would expand the types of validation checks, as well
  //as the types of fields we would be validating (i.e., not just inputs).


  validateField(field) {
    if (field.value.trim() === "" ) {
      field.classList.add("invalid");
    } else {
      field.classList.remove("invalid");
    }
  }


  /* ===========================================================================
                                  validateTab
  =========================================================================== */


  validateTab(){
    const self = this;
    const tabs             = self.form.getElementsByClassName("tab");
    const currentTab       = tabs[self.currentTabIndex];
    const currentTabInputs = currentTab.getElementsByTagName("input");
    let isValid            = true;


    for (let i = 0; i < currentTabInputs.length; i++) {
      const currentInput = currentTabInputs[i];
      if ( currentInput.value.trim() === "" ) {

        //////////////////////////////////////////////////////////////////////////
        //
        //  Note: without the validateField function that works on 'blur', a field with class .invalid
        //  would remain .invalid (looking) even after a user enters valid data and clicks off of the field.
        //  validateField solves this issue by adding/removing class .invalid on blur.
        //
        //  That said, a user could still potentially go straight to clicking the NEXT button,
        //  which is one reason why we also need validateTab to conitionally apply
        //  .invalid at that point as well.
        //
        //////////////////////////////////////////////////////////////////////////
        currentInput.classList.add("invalid");
        isValid = false;
      }
    }


    //If isValid evaluates to true, then add .finish to the the indicator.
    if (isValid) {
      const indicators = self.form.getElementsByClassName("indicator");
      indicators[self.currentTabIndex].classList.add("finish");
    }

    //Return isValid to nextPrev
    return isValid;
  }


  /* ===========================================================================

  =========================================================================== */


  conditionallyRenderButtons(tabIndex){
    const self           = this;
    const tabs           = self.form.getElementsByClassName("tab");
    const previousButton = self.form.getElementsByClassName("previous-button")[0];
    const nextButton     = self.form.getElementsByClassName("next-button")[0];


    //If on the 'Success Tab' hide the buttons.
    if (self.currentTabIndex === tabs.length - 1){
      previousButton.style.display = "none";
      nextButton.style.display     = "none";
      return;
    }

    previousButton.style.display = (tabIndex == 0) ? "none" : "inline";
    nextButton.innerHTML         = (tabIndex == tabs.length - 2) ? "Submit" : "Next";
  }


  /* ===========================================================================
                                   showTab
  =========================================================================== */


  showTab(tabIndex) {
    const self = this;
    const tabs                   = self.form.getElementsByClassName("tab");
    tabs[tabIndex].style.display = "block";
    self.conditionallyRenderButtons(tabIndex);
    self.updateIndicator(tabIndex);
  }


  /* ===========================================================================
                                     nextPrev
  =========================================================================== */


  nextPrev(indexChanger) {
    const self = this;
    const tabs = self.form.getElementsByClassName("tab");

    //indexChanger is either -1 or 1. It will be 1 when clicking on the Next button.
    //Thus we only validate when attempting to move forward to the next form tab.
    //If any field in the current tab is invalid, then we disallow moving forward.
    if (indexChanger == 1 && !self.validateTab()){
      return;
    }

    //Now that we know the current tab is all good, we can hide it:
    tabs[self.currentTabIndex].style.display = "none";

    //Update the value of currentTabIndex by -1 or 1.
    self.currentTabIndex += indexChanger;


    //This occurs on the 'Success Tab'.
    if (self.currentTabIndex === tabs.length - 1) {
      self.form.dispatchEvent(new Event('submit'));
      //Add a return statement if you intend to redirect.
      //return;
    }
    self.showTab(self.currentTabIndex);
  }
}//End of class MultiForm


//Create an instance.
const multiForm = new MultiForm('stepForm1');
