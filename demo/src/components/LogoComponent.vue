<template>
  <svg class="logo hidden-xs" version="1.1" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 818.8 111.5"
    style="enable-background:new 0 0 818.8 111.5;" xml:space="preserve">
    <path class="logo__item--dark" d="M0,111.5V0.1h7.4l69.9,69.8V0.1h22.3v111.4h-8.2L22.3,42.4v69.1
          H0" />
    <path class="logo__item--dark" d="M225.8,111.5V0.1l-81.9-0.1v20.8h59.6v23.8h-34v20.7h34v25.3H144
          v20.8L225.8,111.5" />
    <path class="logo__item--dark" d="M502.3,0.1v20.8h-37.1v90.6h-22.3V20.9h-37.1V0.1L502.3,0.1" />
    <path class="logo__item--light" d="M550.4,95.5c-10.7-10.6-16-23.9-16-39.9
          c0.1-15.7,5.4-28.8,16-39.5c10.6-10.7,23.9-16,39.6-16c15.9,0,29.5,5,40.9,14.9l-14.9,16.3c-7.6-5.9-16.3-8.9-26.1-8.9
          c-10,0-18.1,3.2-24.2,9.4c-6.1,6.2-9.2,14.1-9.2,23.8c0.1,10.4,3.2,18.6,9.3,24.7c6.1,6.1,14.2,9.1,24.2,9.1c8,0,14.2-1.6,18.5-4.8
          V65.4l-14.9,0.1V44.7H631v52c-11.3,9.9-25,14.9-40.9,14.9C574.3,111.5,561,106.1,550.4,95.5" />
    <path class="logo__item--light" d="M674.9,111.5h22.2V0h-22.2V111.5z" />
    <path class="logo__item--light" d="M801.4,3.8c5.7,2.5,11,6.2,16,11.2l-14.9,14.9
          c-5-6-11.9-8.9-20.8-8.9c-8.9,0-14.6,2.1-17.1,6.3c-2.5,4.2-2.5,7.8,0,10.8c2.5,3,8.2,5.2,17.1,6.7c9.4,1,18,4.1,25.6,9.3
          c7.7,5.2,11.5,13.5,11.5,24.9c0,8.9-4.1,16.6-12.3,23c-8.2,6.4-17.7,9.7-28.6,9.7c-10.3,0-19-1.5-25.9-4.4
          c-6.9-3-12.9-6.9-17.8-11.9L749,80.3c5,6,13.4,9.4,25.3,10.4c9.9,0,16.1-2.1,18.5-6.3c2.5-4.2,2.5-8.4,0-12.6
          c-2.4-4.2-8.6-6.8-18.5-7.8c-8.9-1-17.1-3.7-24.5-8.2c-7.4-4.5-11.2-12.1-11.2-23c0-9.9,4.2-17.8,12.7-23.7c8.4-6,17.1-9,26-9
          C787.6,0.1,795.7,1.3,801.4,3.8" />
    <path class="logo__item--dark" d="M340.2,43.3l31.6-43.2h-26.2L327,25.4L340.2,43.3" />
    <path class="logo__item--light" d="M332.8,53.5L293.6,0.1h-26.2l39,53.4l-42.6,58h26.5L332.8,53.5" />
    <path class="logo__item--dark" d="M340.2,63.6l-13.2,18l21.9,29.9h26.4L340.2,63.6" />
  </svg>
</template>

<script setup lang="ts">
</script>

<style>
.logo {
  left: 20px;
  top: 18px;
  width: 130px;
  height: 17.69px;
  vertical-align: middle;
}

.logo .logo__item--dark,
.logo .logo__item--light {
  fill: #aec8e0;
  transition: fill 0.3s;
}

.logo:hover .logo__item--dark {
  fill: #231f20;
}

.logo:hover .logo__item--light {
  fill: #176fc1;
}

.logo--mini {
  width: 20px;
  height: 20px;
  left: 10px;
  top: 14px;
  z-index: 10;
}
</style>
