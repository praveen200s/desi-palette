//p5 sketch to load data for script

let table;
let allPalette;

function preload() {

  table = loadTable(
    "https://cdn.glitch.com/2f3b340c-a092-4719-836c-0f69140bb6e8%2Fdesi-palette.csv?v=1578041686449",
    "csv"
  );
  
}

function setup() {  
  allPalette = new Palette();
  allPalette.extractColors(table);
  allPalette.renderList();
  
  //for visualizatin section
  var canvas = createCanvas(windowWidth, 400);
  canvas.parent('dataviz');
  colorMode(RGB,255);
  background(0, 0, 0);
  
}

function draw(){
  background(0, 0, 0);
  noStroke();
  for(let s of allPalette.swatches){
    for(let c of s.colors){
      
      
      fill(c.r,c.g,c.b,125);
      let x = map(c.r,0,255,0,width);
      let y = map(c.g,0,255,0,height);
      let s = map(c.b,0,255,0,50);
      ellipse(x,y,s,s);
    }
    
  }
  
  
}


//=============================================//
//function draw() {}
Palette.prototype.extractColors = function(table) {
    //cycle through the table
    for (let r = 0; r < table.getRowCount(); r++) {
    //parse the string in table.
    let xml = ParseXML(table.getString(r, 0));
    //select the first child of the palette
    let palette = xml.children[0];
    //create a swatch object.
    let swatch = new Swatch(
      palette.children[0].attributes["name"].value.split("-")[0]
    );
     
    for (let color of palette.children) {
      let c = new SwatchColor(color);
      swatch.addSwatchColor(c);
    }
      
    this.addSwatch(swatch); 
    }
};


Palette.prototype.renderList = function(){
  let palettes = document.getElementById("palettes"); 
  let html = "";  
    for (let swatch of this.swatches){
      html +=
      "<div class='swatch'><!--h4>" +
      swatch.name +
      "</h4-->";
      
      for (let color of swatch.colors){
        html +=
        "<div class='swatchcolor' style='background-color:#" +
        color.rgb +
        ";'>#" +
        color.rgb +
        "</div>";
      }
      
      html += "</div>";
    }

  let p5html = createDiv(html);
  p5html.parent(palettes);
  //console.log(allPalette);
}



function ParseXML(val) {
  let xmlDoc;
  if (window.DOMParser) {
    let parser = new DOMParser();
    xmlDoc = parser.parseFromString(val, "text/xml");
  } // Internet Explorer
  else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.loadXML(val);
  }
  return xmlDoc;
}
function Palette(){
  this.swatches = [];
}
function Swatch(_name) {
  this.name = _name;
  this.colors = [];
}
function SwatchColor(_color) {
  this.name = _color.attributes["name"].value;
  this.rgb = _color.attributes["rgb"].value;
  this.r = _color.attributes["r"].value;
  this.g = _color.attributes["g"].value;
  this.b = _color.attributes["b"].value;
}
Palette.prototype.addSwatch = function(c) {
  this.swatches.push(c);
};
Swatch.prototype.addSwatchColor = function(c) {
  this.colors.push(c);
};
