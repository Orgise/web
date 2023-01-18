# Trucos Emmet

## Introducción
Emmet es un plugin diseñado para editores de texto que mejora en gran medida tu flujo de trabajo y te ahorra tiempo.

[CheatSheet oficial](https://docs.emmet.io/cheat-sheet/)

## Ejemplos HTML

```html

<!-- div#hero.wrapper -->
<div id="hero" class="wrapper"></div>

<!-- div.caja.caja$*3{Caja $} -->
<div class="caja caja1">Caja 1</div>
<div class="caja caja2">Caja 2</div>
<div class="caja caja3">Caja 3</div>

<!-- lorem4 -->
Lorem ipsum dolor sit.

<!-- lorem10 -->
Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, repellendus!

<!-- form#search.wide -->
<form id="search" class="wide"></form>

<!-- ul>li*3>span.hello$ -->
<ul>
    <li><span>hello1</span></li>
    <li><span>hello2</span></li>
    <li><span>hello3</span></li>
</ul>

<!-- h$[title=item$]{Header $}*3 -->
<h1 title="item1">Header 1</h1>
<h2 title="item2">Header 2</h2>
<h3 title="item3">Header 3</h3>

<!-- ul>li.item$$$*5 -->
<ul>
    <li class="item001"></li>
    <li class="item002"></li>
    <li class="item003"></li>
    <li class="item004"></li>
    <li class="item005"></li>
</ul>

<!-- p>{Click }+a{here}+{ to continue} -->
<p>Click <a href="">here</a> to continue</p>

<!-- div+div>p>span+em^bq -->
<div></div>
<div>
    <p><span></span><em></em></p>
    <blockquote></blockquote>
</div>
```

## Ejemplos CSS

```css
/* p10 */
padding: 10px;

/* mt10 */
margin-top: 10px;

/* bd+ */
border: 1px solid #000;
```
