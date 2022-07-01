//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector(".header"),
upbutton = dropArea.querySelector("#multiFileUploader"),
upinput = dropArea.querySelector("#multiFileinput");
var counter = 0;
let file; 
let myfiles = [];//this is a global variable and we'll use it inside multiple functions

upbutton.onclick = ()=>{
  upinput.click(); //if user click on the upbutton then the upinput also clicked
}

upinput.addEventListener("change", function(e){

  let filess = this.files;
  for (var i = 0; i < filess.length; i++) {
    myfiles.push(filess[i]);
  }


  $('#filesNameArea').html('');
  for (var i = 0; i < myfiles.length; i++) {
    addInputRow(i);
  }

});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile(event); //calling function
});


function showFile(evt){
  let fileType = file.type;
  //let validExtensions = ["application/pdf"];
  dataVal = $('.drag-area').data('validextensions');
  let validExtensions = dataVal.split(',');

  if(validExtensions.includes(fileType)){ 
    let dT = new FileReader();
    for (var i = 0; i < evt.dataTransfer.files.length; i++) {
      myfiles.push(evt.dataTransfer.files[i]);
    }
    $('#filesNameArea').html('');
    for (var i = 0; i < myfiles.length; i++) {
      addInputRow(i);
    }
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }else{
    alert("This is not an PDF File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

function fileSize(element){
    var _size = element.size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
    while(_size>900){_size/=1024;i++;}
    var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
    return exactSize;
}

function deleteInput(id){
  myfiles.splice(id, 1);
  $('#filesNameArea').html('');
  for (var i = 0; i < myfiles.length; i++) {
    addInputRow(i);
  }
}

function addInputRow(id){
  let filename = myfiles[id].name;
  let filesize = fileSize(myfiles[id]);
  $('#filesNameArea').append(`
    <div class="row py-2 filesNameAreaRow`+id+`">
      <div class="col-7 col-md-6 pl-0" style="line-height: 16px;">
          `+filename+`
      </div>
      <div class="col-5 col-md-3">
      `+filesize+` <i class="bi bi-check-square-fill text-success" style="padding-left: 5px;"></i>
      </div>
      <div class="col-12 col-md-3">
          <button type="button" class="btn btn-danger py-1" onclick="deleteInput(`+id+`)">
              <i class="bi bi-trash-fill" style="padding-right: 2px;"></i>
              Delete
          </button>
      </div>
    </div>
  `)
}


function pdf_to_doc(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/pdf-to-doc");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}
function doc_to_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/doc-to-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}


function pdf_to_jpg(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/pdf-to-jpg");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function jpg_to_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/jpg-to-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function pdf_to_png(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/pdf-to-png");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function png_to_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/png-to-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function pdf_compressor(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/pdf-compressor");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function crop_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/crop-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function rotate_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/rotate-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function unlock_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/unlock-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function combine_pdf(){
  //pass myfiles - It is the array of all files
  //through azax and response a zip if files are more than 1

  const xhr = new XMLHttpRequest();
  let myform = document.getElementById('myFileInputForm');
  var formData = new FormData(myform);
  for (var i = 0; i < myfiles.length; i++) {
      formData.append("fileList[]", myfiles[i]);
  }

  xhr.open("POST", "/combine-pdf");
  xhr.onreadystatechange = function() {
     document.getElementById("dataResponse").href = xhr.response;
    document.getElementById("dataResponse").style.display = 'block';
  };

  xhr.send(formData);
  console.log('send')


}

function rotateAngleFun(vall){
	$("#rotateAngle").val(vall);
}
