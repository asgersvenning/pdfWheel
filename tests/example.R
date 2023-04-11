library(shiny)

ui <- fluidPage(
  fluidRow(
    div(
      style = "display: flex;",
      h1("Fast PDF viewer for Shiny in R",
         style = "margin: 15px auto;")
    )
  ),
  fluidRow(
    pdfWheelOutput("pdfWheel", 400, 400 / 0.57),
    actionButton("test", "TEST")
  )
)

server <- function(input, output, session) {
  library(pdfWheel)
  library(htmlwidgets)
  addResourcePath("tests", "tests")

  output$pdfWheel <- renderPdfWheel({
    wheel <- pdfWheel("tests/pages", F)

    wheel
  })

  observeEvent(input$test, {
    print("TEST")
    JS("pdfWheel.nextPage();")
  })
}


shinyApp(ui, server)

