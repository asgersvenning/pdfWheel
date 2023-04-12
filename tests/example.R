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
    pdfWheelOutput("testWheel", 400, 400 / 0.57),
    actionButton("nextPage", "Next Page"),
    actionButton("prevPage", "Previous Page"),
    numericInput("choosePage", "Choose Page", 1, 1, 498, 1)
  )
)

server <- function(input, output, session) {
  library(pdfWheel)
  library(htmlwidgets)
  addResourcePath("tests", "tests")

  wheel <- pdfWheel("testWheel", "tests/pages", F)

  output$testWheel <- renderPdfWheel({
    wheel$widget
  })

  print(str(wheel))

  observeEvent(input$nextPage, {
    wheel$nextPage()
  })

  observeEvent(input$prevPage, {
    wheel$prevPage()
  })

  observeEvent(input$choosePage, {
    wheel$changePage(page = input$choosePage)
  })
}


shinyApp(ui, server)

# library(pdfWheel)
#
# test <- pdfWheel("testWheel", "tests/pages", F)
#
# test$widget
# test$prevPage()
