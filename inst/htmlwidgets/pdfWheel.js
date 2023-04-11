var currentPage;
var maxPages;
var prefix;

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
}


function PDFloadPage(el, prefix, page) {
  el.querySelector("span.pdfwheel-control.numeric-selector input").value = page;
  el.querySelector(".pdfwheel-output img.pdfwheel-output-page").src = prefix + "/page_" + page + ".jpg";
};

function PDFnextPage(el) {
  currentPage++;
  if (currentPage > maxPages) {
    currentPage = 1;
  }
  PDFloadPage(el.parentNode.parentNode, prefix, currentPage);
};

function PDFprevPage(el) {
  currentPage--;
  if (currentPage < 1) {
    currentPage = maxPages;
  }
  PDFloadPage(el.parentNode.parentNode, prefix, currentPage);
};

HTMLWidgets.widget({

    name: 'pdfWheel',

    type: 'output',

    factory: function(el, width, height) {
        // Create a div to hold the page

        var controls = "<button class='pdfwheel-control pdfwheel-control-prev' style='border: none; background: #EB9790; margin: auto;'>Previous</button>" + "\n\t" + "<div class='pdfwheel-control-temporary numeric-selector'>An Error Has Ocurred!</div>" + "\n\t" + "<button class='pdfwheel-control pdfwheel-control-next' style='border: none; background: #B6F0B7; margin: auto;'>Next</button>";
        controls = "<div class='pdfwheel-control pdfwheel-control-container' style='width: 100%; height: 5%; display: flex;'>\n\t" + controls + "\n</div>"
        var contents = "<div class='pdfwheel-output' style='width: 100%; height: 95%; position: relative;'>" + "<img class='pdfwheel-output pdfwheel-output-page' src='' style='max-height: 100%; max-width: 100%;'/>" + "\n" + "<div class='pdfwheel-control pdfwheel-control-prev'><img class='pdfwheel-control pdfwheel-control-icon icon-backward' src='pdfWheel-0.1.0/backward.png'></div>" + "\n" + "<div class='pdfwheel-control pdfwheel-control-next'><img class='pdfwheel-control pdfwheel-control-icon icon-forward' src='pdfWheel-0.1.0/forward.png'></div></div>" + controls;
        currentPage = 1;

        return {
          renderValue: function(x) {
              el.innerHTML = contents;
              // Override the margin css attribute default set by the "htmlwidgets" package
              el.style.margin = "auto";
              nextButton   = el.getElementsByClassName("pdfwheel-control-next");
              prevButton   = el.getElementsByClassName("pdfwheel-control-prev");

              nextButton.forEach(function(x) { holdit(x, function() { PDFnextPage(x); }, 300, 30, 50); });
              prevButton.forEach(function(x) { holdit(x, function() { PDFprevPage(x); }, 300, 30, 50); });

              maxPages = x["pages"];
              numericSelector = htmlToElement("<span class='pdfwheel-control numeric-selector' style='display: flex; height: 20px; margin: auto;'><input type='number' value='1' min='1' max='" + maxPages + "' style='border: none; width: 50px; text-align: right; text-'><p>/</p>&nbsp;&nbsp;&nbsp;&nbsp;<b>" + maxPages + "</b></span>");
              el.querySelector(".pdfwheel-control-temporary.numeric-selector").replaceWith(numericSelector);
              prefix   = x["prefix"];

              // Remove buttons
              if (!x["buttons"]) {
                el.querySelectorAll("button.pdfwheel-control").forEach(function(x) { x.remove(); });
              }

              PDFloadPage(el, prefix, currentPage);
              el.querySelector("span.pdfwheel-control.numeric-selector input").addEventListener("input", function() {
                PDFloadPage(el, prefix, el.querySelector("span.pdfwheel-control.numeric-selector input").value);
              });
          },

          resize: function(width, height) {
          },

          changePage: function(page) {
            PDFloadPage(el, prefix, page);
          },

          nextPage: function() {
            PDFnextPage(el);
          },

          prevPage: function() {
            PDFprevPage(el);
          }
        };
    }
});
