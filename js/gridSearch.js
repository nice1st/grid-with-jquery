if (typeof GridSearch === "undefined") {
  var GridSearch = {};
} else {
  console.error("namespace duplication!!! - GridSearch");
}

GridSearch.GridSearch = function($search_area, option) {
  
  this.option = {};
  this.$search_area = $search_area;
  Object.assign(this.option, option);

  this.init = function() {
    this.$search_area.innerHTML = null;
    this.option.listeners = {};

    let $docfrag = document.createDocumentFragment();
    
    const $inputGlobalSearch = document.createElement("input");
    $inputGlobalSearch.type = "text";
    $inputGlobalSearch.placeholder = "Search...";
    $docfrag.appendChild($inputGlobalSearch);
    
    const $a = document.createElement("a");
    $a.href = "#";
    $docfrag.appendChild($a);
    
    const $divLayerArea = document.createElement("div");
    const $dynaminSearchForm = document.createElement("form");
    $divLayerArea.appendChild($dynaminSearchForm);
    $docfrag.appendChild($divLayerArea);
    
    this.$search_area.appendChild($docfrag);
    
    this.addSearchFormChChildren($dynaminSearchForm);
    this.addEventListeners();
  }
  
  this.addSearchFormChChildren = function($dynaminSearchForm) {
    
    let $docfrag = document.createDocumentFragment();
    const columnOptions = this.option.columnOptions;
    for (let index = 0; index < columnOptions.length; index++) {
      const columnOption = columnOptions[index];
      $docfrag.appendChild(makeSearchCondition(columnOption));
    }

    $dynaminSearchForm.appendChild($docfrag);
  }

  function makeSearchCondition(columnOption) {

    const $dl = document.createElement("dl");
    const $dt = document.createElement("dt");
    const $dd = document.createElement("dd");
    const $input = document.createElement("input");

    $dl.style.padding = "5px";
    
    const $textNode = document.createTextNode("");
    // $textNode.appendData("&bull; ");
    $textNode.appendData(columnOption.displayName);
    $dt.appendChild($textNode);
    $dl.appendChild($dt);

    $input.type = "text";
    $input.name = columnOption.field;
    $dd.appendChild($input);
    $dl.appendChild($dd);

    return $dl;
  }

  this.addEventListeners = function() {
    const _this = this;
    const $inputs = this.$search_area.querySelectorAll("input");
    for (let index = 0; index < $inputs.length; index++) {
      const $input = $inputs[index];
      $input.addEventListener("keypress", function(e) {
        if (e.keyCode === 13) {
          _this.emit("gridSearch-submit");
        }
      });
    }
  }

  this.getSearchFormData = function() {
    const $form = this.$search_area.querySelector(":scope form");
    const formData = new FormData($form);
    const $allInput = this.$search_area.querySelector(":scope input");
    const isSearchAll = $allInput.value != "";
    formData.set("search_all", isSearchAll);
    if (isSearchAll) {
      formData.set("search_all", true);
      for (let index = 0; index < formData.keys.length; index++) {
        const key = formData.keys[index];
        formData.set(key, $allInput.value);
      }
    } else { // 추가 작업이 필요한가???
      // const $formInputs = this.$search_area.querySelectorAll("form input");
      // for (let index = 0; index < $formInputs.length; index++) {
      //   const $input = $formInputs[index];
      //   console.log($input);
      // }
    }
    return formData;
  }

  // event emitter.. To-do 상속해야 됨??
  this.addListener = function(label, callback) {
    if (!this.option.listeners.hasOwnProperty(label)) {
      this.option.listeners[label] = [];
    }
    this.option.listeners[label].push(callback);
  }

  this.removeListener = function(label, callback) {
    const listeners = this.option.listeners[label];
    let i = -1;
    for (let index = 0; index < listeners.length; index++) {
      const listener = listeners[index];
      if (typeof listener == "function" && listener === callback) {
        i = index;
        break;
      }
    }
    
    if (i > -1) {
      listeners.splice(index, 1);
      this.option.listeners[label] = listeners;
      return true;
    } else {
      return false;
    }
  }
  
  this.emit = function(label, ...arg) {
    const listeners = this.option.listeners[label];
    
    if (listeners && listeners.length > 0) {
      for (let index = 0; index < listeners.length; index++) {
        const listener = listeners[index];
        listener(...arg);
      }
    }
  }
}