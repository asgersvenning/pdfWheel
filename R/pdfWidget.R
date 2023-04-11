#' pdfWheel; an efficient PDF embedder for Shiny and RMarkdown
#'
#' <Add Description>
#'
#' @param path a character, path to a directory containing the pages of the PDF you wish to embed. File names should be "page_x.jpg" where "x" is the 1-indexed page number.
#' @param buttons a boolean, do you want next/previous page buttons beneath the embedding?
#'
#' @import htmlwidgets
#'
#' @export
pdfWheel <- function(path, buttons = TRUE, width = NULL, height = NULL, elementId = NULL) {

  # Get number of pages from the page directory
  pages <- length(list.files(path))

  # forward options using x
  x = list(
    pages = pages,
    prefix = path,
    buttons = buttons
  )

  # create widget
  htmlwidgets::createWidget(
    name = "pdfWheel",
    x,
    width = width,
    height = height,
    package = 'pdfWheel',
    elementId = elementId
  )
}

#' Shiny bindings for pdfWidget
#'
#' Output and render functions for using pdfWidget within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a pdfWidget
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name pdfWheel-shiny
#'
#' @export
pdfWheelOutput <- function(outputId, width, height = width * sqrt(2)){
  htmlwidgets::shinyWidgetOutput(outputId, 'pdfWheel', width, height, package = 'pdfWheel')
}

#' @rdname pdfWheel-shiny
#' @export
renderPdfWheel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, pdfWheelOutput, env, quoted = TRUE)
}
