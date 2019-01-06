import * as script from "./script.js";

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");

customBtn.addEventListener("click", function(){
    realFileBtn.click();
});

realFileBtn.addEventListener("change", function(event){
    if(realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+\.txt)$/)){
        openFile(event);
    } else {
        document.getElementById("alert2").style.display = 'block';
    }
});

var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      text = text.split("/");
      for(var i = 0; i < text.length; ++i){
          script.processTheCommand(text[i]);
      }
    };
    reader.readAsText(input.files[0]);
};
