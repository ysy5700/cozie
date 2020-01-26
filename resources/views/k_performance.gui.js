<svg id="performance" display="none">

  <use href="#main-question">
    <set href="text" attributeName="text-buffer" to="How is your performance?" />
  </use>

  <use href="#button" id="neutral-performance" pointer-events="visible">
    <set href="circle" attributeName="fill" to="fb-green"/>
    <set href="image" attributeName="href" to="images/icons/nuetral.png"/>
    <set href="text"  attributeName="text-buffer" to="Neutral" />
  </use>

  <use href="#left-button" id="poor-performance" pointer-events="visible">
    <set href="circle" attributeName="fill" to="fb-orange"/>
    <set href="image" attributeName="href" to="images/icons/not-comfy.png"/>
    <set href="text"  attributeName="text-buffer" to="Bad" />
  </use>

  <use href="#right-button" id="good-performance" pointer-events="visible">
    <set href="circle" attributeName="fill" to="fb-cyan"/>
    <set href="image" attributeName="href" to="images/icons/comfy.png"/>
    <set href="text"  attributeName="text-buffer" to="Good" />
  </use>
</svg>