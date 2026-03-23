<template>
  <img
    class="profile-pic"
    src="https://img.freepik.com/free-photo/portrait-beautiful-purebred-pussycat-with-shorthair-orange-collar-neck-sitting-floor-reacting-camera-flash-scared-looking-light-indoor_8353-12551.jpg?semt=ais_hybrid&w=740&q=80"
    alt="profile-pic"
  />
</template>

<style scoped>
.profile-pic {
  width: 100%;         /* fill all available horizontal space */
  height: auto;        /* keep aspect ratio */
  object-fit: cover;   /* crop if the parent constrains height */
  display: block;      /* removes inline gap */
  flex: 1;             /* optional: makes it expand inside flex containers */
}
</style>