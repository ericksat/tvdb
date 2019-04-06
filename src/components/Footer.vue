<template>
  <footer class="myfooter">
      <i>TVDB Search™ ©2019 By Shmoofel Media</i><br>
      <a href="https://nodejs.org/" target="_blank"><i class="fab fa-node-js"></i> Node.js</a> |
      <a href="https://vuejs.org/" target="_blank"><i class="fab fa-vuejs"></i> Vue.js</a> |
      <a href="https://jquery.com/" target="_blank">Jquery</a> |
      <a href="https://getbootstrap.com/" target="_blank"><i class="fab fa-bootstrap"></i> Bootstrap</a>
      <span class="d-none d-md-inline">
        | <a href="https://fontawesome.com/" target="_blank"><i class="fab fa-font-awesome"></i> Font Awesome</a>
      </span>
  </footer>
</template>
<style>
.myfooter {
    position: fixed;
    left: 0; bottom: 0;
    width: 100%;
    padding: 0.5rem 0;
    font-style: italic;
    font-size: 0.9rem;
    text-align: center;
    color: #aaa;
    /* background-color: #333333; */
    background-image: linear-gradient(to right, #666 0%, #222 5%, #222 95%, #666 100%);
    border-top: 1px solid #fff;
    opacity: 0.95;
}

@media screen and (max-height: 359px) {
    .myfooter {
        display: none;
    }
}

.myfooter a {
    color: #f2e4e4;
}
</style>
