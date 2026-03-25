<template>
  <img
    class="profile-pic"
    src="https://media.licdn.com/dms/image/v2/D5603AQEfOSr_CwSyow/profile-displayphoto-crop_800_800/B56ZgnxH1xHQAM-/0/1753013847014?e=1776297600&v=beta&t=kRpmLmspJr3dxdy1_PEW8XmcgyfZ7qsIXw9Nax6kKk4"
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