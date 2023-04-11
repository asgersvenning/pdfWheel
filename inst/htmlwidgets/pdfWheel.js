function holdit(btn, action, start, speedup, minSpeed) {
    var t;
    var originalStart = start;

    var repeat = function () {
        action();
        t = setTimeout(repeat, start);
        if (start > minSpeed) {
          start = start - speedup;
        } else {
          start = minSpeed
        }
    }

    btn.addEventListener("mousedown", function() {
      clearTimeout(t);
      start = originalStart;
      repeat();
    });
    btn.addEventListener("mouseup", function() {
      clearTimeout(t);
      start = originalStart;
    });
};

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
};

function wheel(el, contents) {

  this.el = el;
  this.currentPage = 1;
  this.maxPages = 1;

  wheel.prototype.renderValue = function(data) {
      // Add pdfWheel widget HTML contents
      this.el.innerHTML = contents;
      // Override the margin css attribute default set by the "htmlwidgets" package
      this.el.style.margin = "auto";

      // Set some properties based on data from the R call
      this.maxPages = data["pages"];
      this.prefix   = data["prefix"];
      // Create the page number & input selector
      numericSelector = htmlToElement("<span class='pdfwheel-control numeric-selector' style='display: flex; height: 20px; margin: auto;'><input type='number' value='1' min='1' max='" + this.maxPages + "' style='border: none; width: 50px; text-align: right; text-'><p>/</p>&nbsp;&nbsp;&nbsp;&nbsp;<b>" + this.maxPages + "</b></span>");
      // Insert it into the widget
      this.el.querySelector(".pdfwheel-control-temporary.numeric-selector").replaceWith(numericSelector);

      // Remove buttons
      if (!data["buttons"]) {
        this.el.querySelectorAll("button.pdfwheel-control").forEach(function(x) { x.remove(); });
      }

      // There are buttons and "buttons", so we need to add the eventListeners either way
      var nextButton   = el.getElementsByClassName("pdfwheel-control-next");
      var prevButton   = el.getElementsByClassName("pdfwheel-control-prev");
      Array.prototype.forEach.call(nextButton, function(btn) {
        holdit(btn, this.nextPage, 300, 30, 50);
      }.bind(this));
      Array.prototype.forEach.call(prevButton, function(btn) {
        holdit(btn, this.prevPage, 300, 30, 50);
      }.bind(this));

      // Add eventListener to the page number input

      this.el.querySelector("span.pdfwheel-control.numeric-selector input").addEventListener("input", function() {
          this.changePage(this.el.querySelector("span.pdfwheel-control.numeric-selector input").value);
        }.bind(this));

      // Initialize the image
      this.changePage(this.currentPage);
  };

  wheel.prototype.resize = function(width, height) {
    // TODO
    console.log("!!! RESIZE NOT IMPLEMENTED !!!");
  };

  wheel.prototype.changePage = function(page) {
    // Set the page number accordingly
    this.el.querySelector("span.pdfwheel-control.numeric-selector input").value = page;
    // Change the page
    this.el.querySelector(".pdfwheel-output img.pdfwheel-output-page").src = this.prefix + "/page_" + page + ".jpg";
  }.bind(this);

  wheel.prototype.nextPage = function() {
    this.currentPage++;
    if (this.currentPage > this.maxPages) {
      this.currentPage = 1;
    }
    this.changePage(this.currentPage);
  }.bind(this);

  wheel.prototype.prevPage = function() {
      this.currentPage--;
      if (this.currentPage < 1) {
        this.currentPage = this.maxPages;
      }
      this.changePage(this.currentPage);
  }.bind(this);
}

HTMLWidgets.widget({

    name: 'pdfWheel',

    type: 'output',

    factory: function(el, width, height) {
        // Create a div to hold the page

        var controls = "<button class='pdfwheel-control pdfwheel-control-prev' style='border: none; background: #EB9790; margin: auto;'>Previous</button>" + "\n\t" + "<div class='pdfwheel-control-temporary numeric-selector'>An Error Has Ocurred!</div>" + "\n\t" + "<button class='pdfwheel-control pdfwheel-control-next' style='border: none; background: #B6F0B7; margin: auto;'>Next</button>";
        controls = "<div class='pdfwheel-control pdfwheel-control-container' style='width: 100%; height: 5%; display: flex;'>\n\t" + controls + "\n</div>"
        var contents = "<div class='pdfwheel-output' style='width: 100%; height: 95%; position: relative;'>" + "<img class='pdfwheel-output pdfwheel-output-page' src='' style='max-height: 100%; max-width: 100%;'/>" + "\n" + "<div class='pdfwheel-control pdfwheel-control-prev'><img class='pdfwheel-control pdfwheel-control-icon icon-backward' src='pdfWheel-0.1.0/backward.png'></div>" + "\n" + "<div class='pdfwheel-control pdfwheel-control-next'><img class='pdfwheel-control pdfwheel-control-icon icon-forward' src='pdfWheel-0.1.0/forward.png'></div></div>" + controls;

        return new wheel(el, contents);
    }
});
