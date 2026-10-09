+++
date = '{{ .Date }}'
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
summary = 'One sentence: what it is.'
link = 'https://…'
# image = 'images/projects/{{ .File.ContentBaseName }}.png'   # optional screenshot; without it the card shows a live preview
weight = 10
[build]
  render = 'never'
  list = 'always'
+++
